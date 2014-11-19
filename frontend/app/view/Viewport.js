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
            },{
                dock: 'bottom',
                xtype: 'bottomtoolbar'
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