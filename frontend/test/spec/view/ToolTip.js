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
describe("Dash.view.ToolTip -> onLoad", function() {
    var view = null;
    
    beforeEach(function(){
        if (!view) {
            view = Ext.create('Dash.view.ToolTip');
        }
        
        spyOn(view, 'updateTitleAndTextFromRecords');
        spyOn(view, 'showErrorMsg');
    });
    
    it("should update tooltip",function(){
        var recordsMock = [{},{}];
        var operationsMock = {
            params: {
                p1: 'v1',
                p3: 'v3'
            }
        }
        var successMock = true;

        view.onLoad(recordsMock, operationsMock, successMock);

        expect(view.updateTitleAndTextFromRecords).toHaveBeenCalled();
        expect(view.updateTitleAndTextFromRecords).toHaveBeenCalledWith(
            recordsMock, 
            operationsMock.params
        );
    });
    
    it("should detect ajax failure",function(){
        var recordsMock = [{},{}];
        var operationsMock = {
            params: {
                p1: 'v1',
                p3: 'v3'
            }
        }
        var successMock = false;

        view.onLoad(recordsMock, operationsMock, successMock);

        expect(view.updateTitleAndTextFromRecords).not.toHaveBeenCalled();
        expect(view.showErrorMsg).toHaveBeenCalled();
    });
    
    it("should detect empty records",function(){
        var recordsMock = [];
        var operationsMock = {
            params: {
                p1: 'v1',
                p3: 'v3'
            }
        }
        var successMock = true;

        view.onLoad(recordsMock, operationsMock, successMock);

        expect(view.updateTitleAndTextFromRecords).not.toHaveBeenCalled();
        expect(view.showErrorMsg).toHaveBeenCalled();
    });
    
    it("should detect empty result",function(){
        var recordsMock = null;
        var operationsMock = {
            params: {
                p1: 'v1',
                p3: 'v3'
            }
        }
        var successMock = true;

        view.onLoad(recordsMock, operationsMock, successMock);

        expect(view.updateTitleAndTextFromRecords).not.toHaveBeenCalled();
        expect(view.showErrorMsg).toHaveBeenCalled();
    });
    
});
