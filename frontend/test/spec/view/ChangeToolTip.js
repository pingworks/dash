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
describe("Dash.view.ChangeToolTip -> updateTitleAndTextFromRecords", function() {
    var view = null;
    
    beforeEach(function(){
        if (!view) {
            view = Ext.create('Dash.view.ChangeToolTip');
        }
        
        spyOn(view, 'setTitle');
        spyOn(view, 'update');
        spyOn(view, 'show');
    });
    
    it("should update title",function(){
        var recordMock = {
            get: function(){}
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
    
    it("should update msg",function(){
        var recordMock = {
            get: function(){}
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
    
    it("should escape html",function(){
        var recordMock = {
            get: function(){}
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
