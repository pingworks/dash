/*
 * Copyright (C) 2013 pingworks - Alexander Birk und Christoph Lukas
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
            reload: function() {}
        }

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

