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
describe("Dash.controller.Bundle -> onLoadBundles", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Bundle');
        }
        
        bundlesStoreMock = {
            load: function() {}
        }
        bundleGridMock = {
            setTitle: function() {}
        }
        
        spyOn(ctrl, 'getBundlesStore').andReturn(bundlesStoreMock);
        spyOn(bundlesStoreMock, 'load');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'setTitle');

        ctrl.onLoadBundles('superbranch');
    });
    
    it("should load bundles",function(){
        expect(ctrl.getBundlesStore).toHaveBeenCalled();
        expect(bundlesStoreMock.load).toHaveBeenCalledWith({
            params: {
                branch: 'superbranch'
            }
        });
    });
    
    it("should update grid title", function() {
        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.setTitle).toHaveBeenCalledWith(Ext.String.format(Dash.config.bundlegrid.title, 'superbranch'));
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