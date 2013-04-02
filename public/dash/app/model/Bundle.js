Ext.define('Dash.model.Bundle', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'string' },
        { name: 'branch', type: 'string' },
        { name: 'revision', type: 'string' },
        { name: 'stage1', type: 'int' },
        { name: 'stage2', type: 'int' },
        { name: 'stage3', type: 'int' },
        { name: 'timestamp', type: 'date', convert: function(value, record) { return Ext.Date.parse(value, Dash.config.bundle.dateformat)}},
        { name: 'committer', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.bundle.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    getStageStatus: function(stage) {
        return Ext.StoreMgr.get('StageStatus').getById(this.get('stage' + stage));
    },
    getBranch: function() {
        return Ext.StoreMgr.get('Branches').getById(this.get('branch'));
    }
});

