/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe("Dash.controller.Deployment -> deploymentAllowed", function() {
    var ctrl = null;
    var bundleMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Deployment');
        }
        
        bundleMock = {
            get: function(prop) {
                if (prop == 'foobar') { return 'foobarvalue' }
                if (prop == 'id') { return 'bundle-id' }
                if (prop == 'reqfield') { return 'reqvalue' }
            }
        }
        
        Dash.config.bundlegrid.deployment.required.field = 'reqfield';
    });
    
    it("should return false without bundle",function(){
        var result = ctrl.deploymentAllowed();
        expect(result).toBe(false);
    });
    
    it("should return false when deployment is disabeld and reqfield not reqvalue",function(){
        Dash.config.bundlegrid.deployment.enabled = false;
        Dash.config.bundlegrid.deployment.required.value = '';

        var result = ctrl.deploymentAllowed(bundleMock);
        expect(result).toBe(false);
    });
    
    it("should return false when deployment is disabeld and reqfield is reqvalue",function(){
        Dash.config.bundlegrid.deployment.enabled = false;
        Dash.config.bundlegrid.deployment.required.value = 'reqvalue';

        var result = ctrl.deploymentAllowed(bundleMock);
        expect(result).toBe(false);
    });
    
    it("should return false when deployment is enabeld and reqfield not reqvalue",function(){
        Dash.config.bundlegrid.deployment.enabled = true;
        Dash.config.bundlegrid.deployment.required.value = '';

        var result = ctrl.deploymentAllowed(bundleMock);
        expect(result).toBe(false);
    });
    
    it("should return true when deployment is enabeld and reqfield is reqvalue",function(){
        Dash.config.bundlegrid.deployment.enabled = true;
        Dash.config.bundlegrid.deployment.required.value = 'reqvalue';

        var result = ctrl.deploymentAllowed(bundleMock);
        expect(result).toBe(true);
    });
});

describe("Dash.controller.Deployment -> onShowDeployWindow", function() {
    var ctrl = null;
    var envStoreMock = null;
    var bundleMock = null;
    var windowMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Deployment');
        }

        envStoreMock = {
            load: function() {},
            reload: function() {},
            filter: function() {},
            clearFilter: function() {}
        }
        spyOn(envStoreMock, 'reload').andReturn(true);
        spyOn(envStoreMock, 'filter').andReturn(true);
        spyOn(envStoreMock, 'clearFilter').andReturn(true);

        spyOn(ctrl, 'getEnvironmentsStore').andReturn(envStoreMock);
        
        bundleMock = {
            get: function(prop) {
                if (prop == 'foobar') { return 'foobarvalue' }
                if (prop == 'id') { return 'bundle-id' }
                if (prop == 'reqfield') { return 'reqvalue' }
            }
        };
        
        windowMock = {
            show: function() {}
        };
        
        spyOn(ctrl, 'deploymentAllowed').andReturn(true);
        spyOn(Ext, 'create').andReturn(windowMock);
        spyOn(windowMock, 'show');
    });
    
    it("should do nothing without bundle",function(){
        ctrl.onShowDeployWindow();
        expect(windowMock.show).not.toHaveBeenCalled();
    });
    
    it("should show deployment window",function(){
        ctrl.onShowDeployWindow(bundleMock);
        expect(envStoreMock.reload).toHaveBeenCalled();
        expect(envStoreMock.clearFilter).toHaveBeenCalled();
        expect(envStoreMock.filter).toHaveBeenCalled();
        expect(Ext.create).toHaveBeenCalledWith('Dash.view.DeploymentWindow', { bundle: bundleMock });
        expect(windowMock.show).toHaveBeenCalled();
    });
    
});

describe("Dash.controller.Deployment -> onDeployment", function() {
    var ctrl = null;
    var envStoreMock = null;
    var bundleMock = null;
    var envMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Deployment');
        }

        envStoreMock = {
            load: function() {},
            reload: function() {},
            findRecord: function() {}
        }

        spyOn(ctrl, 'getEnvironmentsStore').andReturn(envStoreMock);

        envMock = {
            set: function() {},
            save: function() {}
        }
        
        spyOn(envStoreMock, 'findRecord').andReturn(envMock);
        spyOn(envMock, 'set');
        spyOn(envMock, 'save');
        
        bundleMock = {
            get: function(prop) {
                if (prop == 'foobar') { return 'foobarvalue' }
                if (prop == 'id') { return 'bundle-id' }
                if (prop == 'reqfield') { return 'reqvalue' }
            }
        };
        
    });
    
    it("should do nothing without bundle or values",function(){
        var result;
        result = ctrl.onDeployment();
        expect(result).toBe(false);
        expect(envMock.set).not.toHaveBeenCalled();

        result = ctrl.onDeployment(bundleMock);
        expect(result).toBe(false);
        expect(envMock.set).not.toHaveBeenCalled();

        result = ctrl.onDeployment(bundleMock, { foo: 'bar'});
        expect(result).toBe(false);
        expect(envMock.set).not.toHaveBeenCalled();
    });
    
    it("should update environment",function(){
        ctrl.onDeployment(bundleMock, { 
            environment: 'foo', 
            name: 'bar',
            lock: 3
        });
        
        expect(envMock.set).toHaveBeenCalledWith('locked', true);
        //expect(envMock.set).toHaveBeenCalledWith('until');
        expect(envMock.set).toHaveBeenCalledWith('by', 'bar');
        expect(envMock.set).toHaveBeenCalledWith('bundle', 'bundle-id');
        expect(envMock.save).toHaveBeenCalled();
    });
    
});

