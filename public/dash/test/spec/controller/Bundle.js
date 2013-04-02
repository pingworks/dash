describe("Dash.controller.Bundle -> onLoadBundles", function() {
    var ctrl = null;
    var bundlesStoreMock = null;
    var bundleGridMock = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Ext.create('Dash.controller.Bundle');
        }
        
        bundlesStoreMock = {
            load: function() {}
        }
        bundleGridMock = {
            setTitle: function() {}
        }
        
        spyOn(ctrl, 'getBundlesStore').andReturn(bundlesStoreMock);
        spyOn(bundlesStoreMock, 'load');
        spyOn(ctrl, 'getBundleGrid').andReturn(bundleGridMock);
        spyOn(bundleGridMock, 'setTitle');

        ctrl.onLoadBundles('superbranch');
    });
    
    it("should load bundles",function(){
        expect(ctrl.getBundlesStore).toHaveBeenCalled();
        expect(bundlesStoreMock.load).toHaveBeenCalledWith({
            params: {
                branch: 'superbranch'
            }
        });
    });
    
    it("should update grid title", function() {
        expect(ctrl.getBundleGrid).toHaveBeenCalled();
        expect(bundleGridMock.setTitle).toHaveBeenCalledWith(Ext.String.format(Dash.config.bundlegrid.title, 'superbranch'));
    });
    
});

describe("Dash.controller.Bundle -> getStageStatusIcon", function() {
    var ctrl = null;
    var icon = null;
    
    beforeEach(function(){
        if (!ctrl) {
            ctrl = Dash.app.getController('Bundle');
        }
        
        bundleMock = {
            getStageStatus: function() {}
        }
        stageStatusMock = {
            get: function() {}
        }
        
    });
    
    it("should return icon if exists",function(){
        spyOn(bundleMock, 'getStageStatus').andReturn(stageStatusMock);
        spyOn(stageStatusMock, 'get').andReturn('thisIsAnIconObject');

        icon = ctrl.getStageStatusIcon(bundleMock, 3);

        expect(bundleMock.getStageStatus).toHaveBeenCalled();
        expect(stageStatusMock.get).toHaveBeenCalledWith('icon');
        expect(icon).toBe('thisIsAnIconObject');
    });
    
    it("should return null if icon does not exist",function(){
        spyOn(bundleMock, 'getStageStatus').andReturn(undefined);
        spyOn(stageStatusMock, 'get').andReturn('thisIsAnIconObject');

        icon = ctrl.getStageStatusIcon(bundleMock, 3);

        expect(bundleMock.getStageStatus).toHaveBeenCalled();
        expect(stageStatusMock.get).not.toHaveBeenCalled();
        expect(icon).toBeNull();
    });
    
});