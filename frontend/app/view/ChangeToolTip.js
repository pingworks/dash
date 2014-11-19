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
Ext.define("Dash.view.ChangeToolTip", {
    extend: 'Dash.view.ToolTip',
    alias: 'widget.changetooltip',
    
    updateTitleAndTextFromRecords: function(records, params) {
        var msg = '';
        Ext.each(records, function(record) {
            html = Ext.String.htmlEncode(record.get('msg'))
            msg += html.split(' ').join('&nbsp;').split('\n').join('<br />');
        });
        var title = Ext.String.format(Dash.config.change.title, params.bundle);
        this.setTitle(title);
        this.update(msg);
        this.show();
    }
});