/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
 * Copyright 2014 //SEIBERT/MEDIA - Lars-Erik Kimmel
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
Ext.define("Dash.view.EnvironmentGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.environmentgrid',
    requires: ['Ext.grid.column.Action'],
    store: 'Environments',
    width: '100%',

    id: 'EnvironmentGrid',

    urlRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var newValue = '';
        if (Ext.isArray(value)) {
            Ext.each(value, function(item) {
                newValue += Ext.String.format(Dash.config.environmentgrid.envlink, item.url, item.name) + '<br />';
            });
        }
        return newValue;
    },

    initComponent: function() {
        var that = this;
        this.columns = [
            {
                text: 'Id',
                dataIndex: 'id',
                type: 'string',
                width: 90,
                hidden: true
            },
            {
                text: 'Environment',
                dataIndex: 'name',
                type: 'string',
                width: 150
            },
            {
                text: 'Domainname',
                dataIndex: 'domainname',
                type: 'string',
                width: 180,
                hidden: true
            },
            {
                text: 'belegt',
                dataIndex: 'locked',
                type: 'boolean',
                renderer: function(value) {
                    return (value) ? 'ja' : 'nein';
                },
                width: 60
            },
            {
                text: 'von',
                dataIndex: 'by',
                type: 'string',
                width: 90
            },
            {
                text: 'bis',
                dataIndex: 'until',
                type: 'date',
                renderer: Ext.util.Format.dateRenderer(Dash.config.environmentgrid.dateformat),
                width: 150
            }, {
                text: '',
                xtype: 'actioncolumn',
                width: 60,
                items: [{
                    icon: Dash.config.bundlegrid.icon.lockExtension,
                    handler: function(gridview, rowIndex, colIndex, item, event, record) {
                        that.fireEvent('showLockExtensionWindow', record);
                    }
                }],
                renderer: this.deploymentActionRenderer,
                scope: this
            },
            {
                text: 'deployed',
                dataIndex: 'bundle',
                type: 'string',
                width: 120
            },
            {
                text: Dash.config.deployment.features.content.label,
                dataIndex: 'content',
                type: 'string',
                width: 120,
                hidden: true
            },
            {
                text: 'URLs',
                dataIndex: 'urls',
                type: 'string',
                renderer: this.urlRenderer,
                flex: 1
            }
        ];
        this.callParent(arguments);
    }
});