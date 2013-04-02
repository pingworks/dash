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
