Ext.define('Dash.store.StageStatus', {
    extend: 'Ext.data.Store',
    requires: 'Dash.model.StageStatus',
    model: 'Dash.model.StageStatus',
    data: Dash.config.stagestatus.data
});