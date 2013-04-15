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