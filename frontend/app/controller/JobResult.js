Ext.define('Dash.controller.JobResult', {
    extend: 'Ext.app.Controller',
    stores: ['JobResults'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
            'bundlegrid': {
                loadJobResult: this.onLoadJobResult
            }
        });
    },
    onLoadJobResult: function(bundle, stage, tooltip) {
        this.getBundleGrid().on('hideAllTooltips', function() {
            tooltip.destroy();
        });
        this.getJobResultsStore().load({
            params: { 
                bundle: bundle.get('id'),
                branch: bundle.get('branch'),
                stage: stage
            },
            scope: tooltip,
            callback: tooltip.onLoad 
        });
    }
});