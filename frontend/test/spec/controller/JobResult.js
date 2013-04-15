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
describe("Dash.controller.JobResult -> onLoadJobResults", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.JobResult');
        }
        
        jobResultsStoreMock = {
            load: function() {}
        }
        bundleGridMock = {
            on: function() {}
        }
        bundleMock = {
            get: function(prop) {
                if (prop == 'branch') { return 'superbranch' }
                if (prop == 'id') { return 'bundle-id' }
            }
        }
        toolTipMock = {
            onLoad: function() {
            }
        }
        
        spyOn(ctrl, 'getJobResultsStore').andReturn(jobResultsStoreMock);
        spyOn(jobResultsStoreMock, 'load');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'on');

        ctrl.onLoadJobResult(bundleMock, 42, toolTipMock);
    });
    
    it("should load JobResults",function(){
        expect(ctrl.getJobResultsStore).toHaveBeenCalled();
        expect(jobResultsStoreMock.load).toHaveBeenCalledWith({
            params: {
                branch: 'superbranch',
                bundle: 'bundle-id',
                stage: 42
            },
            scope: toolTipMock,
            callback: toolTipMock.onLoad
        });
    });
    
    it("should register hideAllToolTips listener", function() {
        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.on).toHaveBeenCalledWith('hideAllTooltips', jasmine.any(Function));
    });
    
});
