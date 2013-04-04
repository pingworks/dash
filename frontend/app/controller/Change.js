Ext.define('Dash.controller.Change', {
    extend: 'Ext.app.Controller',
    stores: ['Changes'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
            'bundlegrid': {
                loadChanges: this.onLoadChanges
            }
        });
    },
    onLoadChanges: function(bundle, tooltip) {
        this.getBundleGrid().on('hideAllTooltips', function() {
            tooltip.destroy();
        });                    
        this.getChangesStore().load({
            params: { 
                branch: bundle.get('branch'),
                bundle: bundle.get('id')
            },
            scope: tooltip,
            callback: tooltip.onLoad 
        });
    }
});