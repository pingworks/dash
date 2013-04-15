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
