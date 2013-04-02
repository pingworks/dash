Ext.define('Dash.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Dash.view.TopToolbar',
        'Dash.view.BundleGrid'
    ],

    layout: {
        type: 'fit'
    },

    initComponent: function() {
        this.items = {
            xtype: 'panel',
            dockedItems: [{
                dock: 'top',
                xtype: 'toptoolbar'
            }],
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'bundlegrid'
            }]
        }
        this.callParent();
    }
});