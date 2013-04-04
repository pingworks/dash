Ext.define('Dash.model.JobResult', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'string' },
        { name: 'stage', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'total', type: 'int' },
        { name: 'skipped', type: 'int' },
        { name: 'failed', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.jobresult.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    getJobStatus: function() {
        var jobStatus = Ext.StoreMgr.get('JobStatus').getById(this.get('status'));
        if (!jobStatus)
            jobStatus = Ext.StoreMgr.get('JobStatus').getById('-');
        return jobStatus;
    }
});

