Ext.define("Dash.view.ChangeToolTip", {
    extend: 'Dash.view.ToolTip',
    alias: 'widget.changetooltip',
    
    updateTitleAndTextFromRecords: function(records, params) {
        var msg = '';
        Ext.each(records, function(record) {
            html = Ext.String.htmlEncode(record.get('msg'))
            msg += html.split('\n').join('<br />');
        });
        var title = Ext.String.format(Dash.config.change.title, params.bundle);
        this.setTitle(title);
        this.update(msg);
        this.show();
    }
});