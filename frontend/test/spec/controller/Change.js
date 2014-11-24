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
describe("Dash.controller.Change -> onLoadChanges", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;

    beforeEach(function() {
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Change');
        }

        changesStoreMock = {
            load: function() {
            }
        }
        bundleGridMock = {
            on: function() {
            }
        }
        bundleMock = {
            get: function(prop) {
                if (prop == 'branch') {
                    return 'superbranch'
                }
                if (prop == 'id') {
                    return 'bundle-id'
                }
            }
        }
        toolTipMock = {
            onLoad: function() {
            }
        }

        spyOn(ctrl, 'getChangesStore').andReturn(changesStoreMock);
        spyOn(changesStoreMock, 'load');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'on');

        ctrl.onLoadChanges(bundleMock, toolTipMock);
    });

    it("should load changes", function() {
        expect(ctrl.getChangesStore).toHaveBeenCalled();
        expect(changesStoreMock.load).toHaveBeenCalledWith({
            params: {
                branch: 'superbranch',
                bundle: 'bundle-id'
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
