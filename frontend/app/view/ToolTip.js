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
Ext.define("Dash.view.ToolTip", {
    extend: 'Ext.tip.ToolTip',
    closable: true,
    autoHide: false,
    anchor: 'left',
    maxWidth: 1000,
    maxHeight: 600,
    dismissDelay: 1000,
    autoScroll: true,

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