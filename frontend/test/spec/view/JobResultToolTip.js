describe("Dash.view.JobResultToolTip -> updateTitleAndTextFromRecords", function() {
    var view = null;
    
    beforeEach(function(){
        if (!view) {
            view = Ext.create('Dash.view.JobResultToolTip');
        }
        
        spyOn(view, 'setTitle');
        spyOn(view, 'update');
        spyOn(view, 'show');
    });
    
    it("should update title",function(){
        var recordMock = {
            get: function(){},
            getJobStatus: function(){}
        }
        var jobStatusMock = {
            get: function(){}
        }
        spyOn(recordMock, 'get').andReturn('');
        spyOn(recordMock, 'getJobStatus').andReturn(jobStatusMock);
        spyOn(jobStatusMock, 'get').andReturn('');
        var recordsMock = [recordMock];
        var paramsMock = {
            stage: 'v1',
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.setTitle).toHaveBeenCalled();
        expect(view.setTitle).toHaveBeenCalledWith('v1mappedStagev3');
    });
    
    it("should update msg",function(){
        var recordMock = {
            get: function(){},
            getJobStatus: function(){}
        }
        var jobStatusMock = {
            get: function(){}
        }
        spyOn(recordMock, 'get').andReturn('1');
        spyOn(recordMock, 'getJobStatus').andReturn(jobStatusMock);
        spyOn(jobStatusMock, 'get').andReturn('2');
        var recordsMock = [recordMock];
        var paramsMock = {
            stage: 'v1',
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.update).toHaveBeenCalled();
        expect(view.update).toHaveBeenCalledWith('111111path2');
    });
    
    it("should escape html",function(){
        var recordMock = {
            get: function(){},
            getJobStatus: function(){}
        }
        var jobStatusMock = {
            get: function(){}
        }
        spyOn(recordMock, 'get').andReturn('<');
        spyOn(recordMock, 'getJobStatus').andReturn(jobStatusMock);
        spyOn(jobStatusMock, 'get').andReturn('<');
        var recordsMock = [recordMock, recordMock];
        var paramsMock = {
            stage: 'v1',
            bundle: 'v3'
        }

        view.updateTitleAndTextFromRecords(recordsMock, paramsMock);

        expect(view.update).toHaveBeenCalled();
        expect(view.update).toHaveBeenCalledWith(
            '&lt;&lt;&lt;&lt;&lt;&lt;path<'
            + '<br />'
            + '&lt;&lt;&lt;&lt;&lt;&lt;path<'
        );
    });
    
});
