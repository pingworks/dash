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
