Ext.define('Dash.model.Branch', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.branch.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

