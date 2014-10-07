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
Ext.define("Dash.view.TopToolbar", {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.toptoolbar',
    height: 80,

    initComponent: function() {
        this.items = Dash.config.toolbar.left;
        this.items = this.items.concat({
            xtype: 'component',
            html: '',
            width: 50
        }, Dash.config.toolbar.links, '->', {
            id: 'ReloadButton',
            icon: 'resources/img/icons/refresh.png',
            handler: function() {
                this.findParentByType('toolbar').fireEvent('loadBundles');
            }
        }, {
			xtype: 'combo',
			id: 'BranchButtonMenu',
			store: Ext.StoreMgr.get('Branches'),
			emptyText: 'Branch',
			valueField: 'id',
			displayField: 'name',
			typeAhead: true,
			typeAheadDelay: 0,
			autoScroll: true,
			autoSelect: true,
			forceSelection: true,
			minChars: 1,
			queryMode: 'local',
			listeners: {
				select: function(combo, records, eOpts) {
					var selectedBranchId = records[0].get('id');
					this.findParentByType('toolbar').fireEvent('loadBundles', selectedBranchId);
				}
			}
        });

        this.callParent(arguments);
    }
});