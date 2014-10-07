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