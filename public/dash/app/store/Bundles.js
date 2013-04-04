Ext.define('Dash.store.Bundles', {
    extend: 'Ext.data.Store',
    requires: 'Dash.model.Bundle',
    model: 'Dash.model.Bundle',
    sorters: [{
        property: Dash.config.bundlegrid.sort.field,
        direction: Dash.config.bundlegrid.sort.dir
    }]
});