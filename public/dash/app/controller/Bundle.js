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
    },
    onLoadBundles: function(branch) {
        this.getBundlesStore().load({
            params: {
                branch: branch
            }
        });
        this.getBundleGrid().setTitle(Ext.String.format(Dash.config.bundlegrid.title, branch));
    },
    getStageStatusIcon: function(bundle, stage) {
        var stageStatus = bundle.getStageStatus(stage);
        return (stageStatus) ? stageStatus.get('icon') : null;
    }
});