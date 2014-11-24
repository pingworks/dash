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
Ext.define('Dash.controller.Branch', {
    extend: 'Dash.controller.Base',
    stores: ['Branches'],
    refs: [
        {
            selector: 'bundlegrid',
            ref: 'bundleGrid'
        }
    ],
    init: function() {
        this.control({
            'toptoolbar': {
                loadBranches: this.onLoadBranches
            }
        });

        // reloadTimer
        var reloadTask = Ext.TaskManager.start({
            interval: Dash.config.bundlegrid.reload,
            fireOnStart: false
        });
        this.callParent(arguments);
    },
    onLoadBranches: function(options) {
        this.getBranchesStore().load(options);
    }
});