describe("Dash.controller.Change -> onLoadChanges", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Change');
        }
        
        changesStoreMock = {
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
        
        spyOn(ctrl, 'getChangesStore').andReturn(changesStoreMock);
        spyOn(changesStoreMock, 'load');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'on');

        ctrl.onLoadChanges(bundleMock, toolTipMock);
    });
    
    it("should load changes",function(){
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
