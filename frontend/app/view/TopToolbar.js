Ext.define("Dash.view.TopToolbar", {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.toptoolbar',
    requires: 'Dash.view.StoreMenu',
    height: 80,
    
    initComponent: function() {
        this.items = Dash.config.toolbar.left;
        this.items = this.items.concat({
            xtype: 'component',
            html: '',
            width: 50
        }, Dash.config.toolbar.links, '->', {
            icon: 'resources/img/icons/refresh.png',
            handler: function() {
                Ext.StoreMgr.get('Bundles').reload();
            }
        }, {
            text: 'Branch',
            menu: Ext.create('Dash.view.StoreMenu', {
                store: Ext.StoreMgr.get('Branches'),
                itemsHandler: function(item, evt) {
                    this.findParentByType('toolbar').fireEvent('loadBundles', item.id);
                },
                nameField: 'name',
                autoReload: false
            })
        });
        
        this.callParent(arguments);
    }
});