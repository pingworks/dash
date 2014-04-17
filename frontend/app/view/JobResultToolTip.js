/*
 * Copyright (C) 2013 pingworks - Alexander Birk und Christoph Lukas
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
                    Ext.String.format(Dash.config.jobstatus.iconpath, jobResult.getJobStatus().get('icon')),
                    jobResult.getJobStatus().get('cls')
                )
            );
        });
        var title = Ext.String.format(Dash.config.jobresult.title,
            params.stage,
            Dash.config.jobresult.stageMap[params.stage],
            params.bundle
        );
        this.setTitle(title);
        this.update(msgs.join(''));
        this.show();
    }
});