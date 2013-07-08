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
Ext.define("Dash.view.EnvironmentGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.environmentgrid',
    requires: [],
    store: 'Environments',
    width: '100%',
    
    id: 'EnvironmentGrid',
    
    urlRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var newValue='';
        if (Ext.isArray(value)) {
            Ext.each(value, function(item) {
                newValue += Ext.String.format(Dash.config.environmentgrid.envlink, item.url, item.name) + '<br />';
            });
        }
        return newValue;
    },
    
    initComponent: function() {
        var that = this;
        this.columns = [{
            text: 'Id',
            dataIndex: 'id',
            type: 'string',
            width: 90,
            hidden: true
        }, {
            text: 'Environment',
            dataIndex: 'name',
            type: 'string',
            width: 150
        }, {
            text: 'Domainname',
            dataIndex: 'domainname',
            type: 'string',
            width: 180
        }, {
            text: 'belegt',
            dataIndex: 'locked',
            type: 'boolean',
            renderer: function(value) { return (value) ? 'ja' : 'nein'; },
            width: 60
        }, {
            text: 'von',
            dataIndex: 'by',
            type: 'string',
            width: 90
        }, {
            text: 'bis',
            dataIndex: 'until',
            type: 'date',
            renderer: Ext.util.Format.dateRenderer(Dash.config.environmentgrid.dateformat),
            width: 150
        }, {
            text: 'deployed',
            dataIndex: 'bundle',
            type: 'string',
            width: 120
        }, {
            text: Dash.config.deployment.features.content.label,
            dataIndex: 'content',
            type: 'string',
            width: 120
        }, {
            text: 'URLs',
            dataIndex: 'urls',
            type: 'string',
            renderer: this.urlRenderer,
            flex: 1
        }];
        this.callParent(arguments);
    }
});