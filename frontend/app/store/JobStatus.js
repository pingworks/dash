Ext.define('Dash.store.JobStatus', {
    extend: 'Ext.data.Store',
    requires: 'Dash.model.JobStatus',
    model: 'Dash.model.JobStatus',
    data: Dash.config.jobstatus.data
});