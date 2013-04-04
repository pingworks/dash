Ext.define("Dash.view.JobResultToolTip", {
    extend: 'Dash.view.ToolTip',
    alias: 'widget.jobresulttooltip',
    
    updateTitleAndTextFromRecords: function(records, params) {
        var msgs = [];
        Ext.each(records, function(jobResult) {
            msgs.push(
                Ext.String.format(Dash.config.jobresult.text, 
                    Ext.String.htmlEncode(jobResult.get('name')), 
                    Ext.String.htmlEncode(jobResult.get('url')), 
                    Ext.String.htmlEncode(jobResult.get('status')), 
                    Ext.String.htmlEncode(jobResult.get('total')), 
                    Ext.String.htmlEncode(jobResult.get('skipped')), 
                    Ext.String.htmlEncode(jobResult.get('failed')),
                    Ext.String.format(Dash.config.jobstatus.iconpath, jobResult.getJobStatus().get('icon'))
                )
            );
        });
        var title = Ext.String.format(Dash.config.jobresult.title,
            params.stage,
            Dash.config.jobresult.stageMap[params.stage],
            params.bundle
        );
        this.setTitle(title);
        this.update(msgs.join('<br />'));
        this.show();
    }
});