Ext.define("Dash.view.ToolTip", {
    extend: 'Ext.tip.ToolTip',
    closable: true,
    autoHide: false,
    anchor: 'left',
    maxWidth: 1000,
    dismissDelay: 1000,
    
    onLoad: function(records, operation, success) {
        if (records && records.length > 0 && success) {
            this.updateTitleAndTextFromRecords(records, operation.params);
        }
        else {
            this.showErrorMsg();
        }
    },
    
    updateTitleAndTextFromRecords: function() {
    },
    
    showErrorMsg: function() {
        this.setTitle(Dash.config.error.title);
        this.update(Dash.config.error.msg);
        this.show();
    }
});