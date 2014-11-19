/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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