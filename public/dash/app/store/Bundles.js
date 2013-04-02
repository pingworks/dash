Ext.define('Dash.store.Bundles', {
    extend: 'Ext.data.Store',
    requires: 'Dash.model.Bundle',
    model: 'Dash.model.Bundle',
    sorters: [{
        property: 'revision',
        direction: 'DESC'
    }]
});