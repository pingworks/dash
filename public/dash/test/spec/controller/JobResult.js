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
