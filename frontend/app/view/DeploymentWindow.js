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
Ext.define("Dash.view.DeploymentWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.deploymentwindow',
    requires: 'Ext.form.Panel',
    
    id: 'DeploymentWindow',
    title: 'Deployment',
    height: 200,
    width: 600,
    items: [{
        xtype: 'form',
        border: false,
        padding: 10,
        defaults: {
            width: 500
        },
        items: [{
	        xtype: 'combobox',
            name: 'environment',
	        fieldLabel: 'Environment',
	        store: 'Environments',
	        queryMode: 'local',
	        displayField: 'label',
	        valueField: 'id',
	        border: false,
	        forceSelection: true,
	        allowBlank: false,
            validator: function(value) {
                var record = this.getStore().findRecord('label', value);
                return ! (record && record.get('locked'));
            }
	    }, {
	        xtype: 'textfield',
            name: 'name',
            maxLength: 10,
	        fieldLabel: 'Name',
            allowBlank: false
	    }, {
	        xtype: 'combobox',
            name: 'lock',
	        fieldLabel: 'Nutzungsdauer',
	        store: 'LockDurations',
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'id',
	        border: false,
	        forceSelection: true,
            allowBlank: false
	    }],
        bbar: ['->', {
            xtype: 'button',
            text: 'Abbrechen',
            handler: function(button, event){
                button.findParentByType('window').destroy();
            }
        }, {
            xtype: 'button',
            text: 'Deploy',
            handler: function(button, event){
                var form = button.findParentByType('form');
                var window = button.findParentByType('window');
                if (form.isValid()) {
                    window.fireEvent('deployment', window.bundle, form.getValues());
                }
            }
        }]
    }]
});
