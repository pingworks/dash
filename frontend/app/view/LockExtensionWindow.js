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
Ext.define("Dash.view.LockExtensionWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.lockextensionwindow',
    requires: ['Ext.String', 'Ext.form.Panel'],

    id: 'LockExtensionWindow',
    title: 'Nutzungsdauer verlängern',
    width: 600,
    items: [{
        xtype: 'form',
        border: false,
        padding: 10,
        defaults: {
            width: 550,
            labelWidth: 150
        },
        items: [{
	        xtype: 'textfield',
            id: 'By',
            name: 'by',
            maxLength: 10,
	        fieldLabel: 'Von',
            allowBlank: false
	    }, {
	        xtype: 'combobox',
            id: 'Lock',
            name: 'lock',
	        fieldLabel: 'Nutzungsdauer',
	        store: 'LockDurations',
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'id',
	        border: false,
	        forceSelection: true,
            allowBlank: false,
            listConfig: {
                id: 'LockList'
            }
	    }],
        bbar: ['->', {
            xtype: 'button',
            id: 'Cancel',
            text: 'Abbrechen',
            handler: function(button, event){
                button.findParentByType('window').destroy();
            }
        }, {
            xtype: 'button',
            id: 'Extend',
            text: 'Verlängern',
            handler: function(button, event){
                var form = button.findParentByType('form');
                var window = button.findParentByType('window');
                if (form.isValid()) {
                    window.fireEvent('lockExtension', window.environment, form.getValues());
                }
            }
        }]
    }],
	listeners: {
		show: function (window) {
            var environment = window.environment;
            window.setTitle(Ext.String.format("Nutzungsdauer für Maschine '{0}' mit Bundle '{1}' verlängern", environment.get('name'), environment.get('bundle')));
			var data = environment.getData();
			window.down('form').getForm().setValues(data);
		}
	}
});
