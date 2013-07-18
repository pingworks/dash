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