Ext.define('Dash.model.Change', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'string' },
        { name: 'msg', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.change.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

