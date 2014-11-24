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
describe("Dash.view.ChangeToolTip -> updateTitleAndTextFromRecords", function() {
    var view = null;

    beforeEach(function() {
        if (!view) {
            view = Ext.create('Dash.view.ChangeToolTip');
        }

        spyOn(view, 'setTitle');
        spyOn(view, 'update');
        spyOn(view, 'show');
    });

    it("should update title", function() {
        var recordMock = {
            get: function() {
            }
        }
        spyOn(recordMock, 'get').andReturn('');
        var recordsMock = [recordMock];
        var paramsMock = {
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.setTitle).toHaveBeenCalled();
        expect(view.setTitle).toHaveBeenCalledWith('v3');
    });

    it("should update msg", function() {
        var recordMock = {
            get: function() {
            }
        }
        spyOn(recordMock, 'get').andReturn('1');
        var recordsMock = [recordMock];
        var paramsMock = {
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.update).toHaveBeenCalled();
        expect(view.update).toHaveBeenCalledWith('1');
    });

    it("should escape html", function() {
        var recordMock = {
            get: function() {
            }
        }
        spyOn(recordMock, 'get').andReturn('<\n<');
        var recordsMock = [recordMock];
        var paramsMock = {
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.update).toHaveBeenCalled();
        expect(view.update).toHaveBeenCalledWith(
            '&lt;'
                + '<br />'
                + '&lt;'
        );
    });

});
