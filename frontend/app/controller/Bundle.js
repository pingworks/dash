Ext.define('Dash.controller.Bundle', {
    extend: 'Ext.app.Controller',
    stores: ['Bundles', 'StageStatus', 'Branches'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
            'toptoolbar': {
                loadBundles: this.onLoadBundles
            }
        });
        
        // reloadTimer
        var bundlesStore = this.getBundlesStore(); 
        var reloadTask = Ext.TaskManager.start({
            run: function() {
                bundlesStore.reload()
            },
            interval: Dash.config.bundlegrid.reload,
            fireOnStart: false
        });
    },
    onLoadBundles: function(branch) {
        this.getBundlesStore().load({
            params: {
                branch: branch
            }
        });
        this.getBundleGrid().setTitle(Ext.String.format(Dash.config.bundlegrid.title, branch));
    },
    getStageStatus: function(bundle, stage) {
        return bundle.getStageStatus(stage);
    }
});