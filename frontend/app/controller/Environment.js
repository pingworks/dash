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
Ext.define('Dash.controller.Environment', {
    extend: 'Dash.controller.Base',
    requires: [],
    stores: ['Environments'],
    refs: [{
        selector: 'environmentswindow',
        ref: 'environmentsWindow'
    }],
    init: function() {
        this.control({
            'toptoolbar': {
                showEnvironmentsWindow: this.onShowEnvironmentsWindow
            }
        });
        this.control({
            'bundlegrid': {
                hideEnvironmentsWindow: this.onHideEnvironmentsWindow
            }
        });
        this.callParent(arguments);
    },
    onShowEnvironmentsWindow: function() {
        this.getEnvironmentsStore().reload();
        this.getEnvironmentsStore().clearFilter(true);
        window = Ext.create('Dash.view.EnvironmentsWindow').show();
    },
    onHideEnvironmentsWindow: function() {
        var win = this.getEnvironmentsWindow()
        win && win.destroy();
    },
    onError: function(response, options) {
        this.onHideEnvironmentsWindow();
        this.callParent(arguments);
    }
});