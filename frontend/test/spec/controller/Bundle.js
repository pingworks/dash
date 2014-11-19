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
describe("Dash.controller.Bundle -> onLoadBundles", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Bundle');
        }
        
        bundlesStoreMock = {
            load: function() {},
            reload: function() {}
        }
        bundleGridMock = {
            setTitle: function() {},
            fireEvent: function() {}
        }
        
        spyOn(ctrl, 'getBundlesStore').andReturn(bundlesStoreMock);
        spyOn(bundlesStoreMock, 'load');
        spyOn(bundlesStoreMock, 'reload');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'setTitle');
        spyOn(bundleGridMock, 'fireEvent');

    });
    
    it("should load bundles",function(){
        ctrl.onLoadBundles('superbranch');
        
        expect(ctrl.getBundlesStore).toHaveBeenCalled();
        expect(bundlesStoreMock.load).toHaveBeenCalledWith({
            params: {
                branch: 'superbranch'
            }
        });
    });
    
    it("should update grid title", function() {
        ctrl.onLoadBundles('superbranch');
        
        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.setTitle).toHaveBeenCalledWith(Ext.String.format(Dash.config.bundlegrid.title, 'superbranch'));
    });
    
    it("should not update grid title on reload", function() {
        ctrl.onLoadBundles();
        
        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.setTitle).not.toHaveBeenCalled();
    });
    
    it("should hide all tooltips on reload",function(){
        ctrl.onLoadBundles('superbranch');

        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.fireEvent).toHaveBeenCalledWith('hideAllTooltips');
    });
    
});

describe("Dash.controller.Bundle -> getStageStatus", function() {
    var ctrl = null;
    var icon = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Dash.app.getController('Bundle');
        }
        
        bundleMock = {
            getStageStatus: function() {}
        }
        stageStatusMock = {
        }
        
    });
    
    it("should return stagestatus if exists",function(){
        spyOn(bundleMock, 'getStageStatus').andReturn(stageStatusMock);

        stageStatus = ctrl.getStageStatus(bundleMock, 3);

        expect(bundleMock.getStageStatus).toHaveBeenCalled();
        expect(stageStatus).toBe(stageStatusMock);
    });
    
    it("should return null if icon does not exist",function(){
        spyOn(bundleMock, 'getStageStatus').andReturn(undefined);

        stageStatus = ctrl.getStageStatus(bundleMock, 3);

        expect(bundleMock.getStageStatus).toHaveBeenCalled();
        expect(stageStatus).toBeUndefined();
    });
    
});