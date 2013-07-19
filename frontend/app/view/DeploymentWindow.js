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
    requires: ['Ext.form.Panel','Ext.form.Checkbox'],
    
    id: 'DeploymentWindow',
    title: 'Deployment',
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
	        xtype: 'combobox',
            id: 'EnvironmentCombo',
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
                var overwriteField = this.findParentByType('form').getForm().findField('overwrite');
                return (!record || !record.get('locked') || overwriteField.getValue());
            },
            listConfig: {
                id: 'EnvList'
            }
        }, {
            xtype: 'checkbox',
            id: 'LockOverwrite',
            name: 'overwrite',
            fieldLabel: 'Lock überschreiben',
            inputValue: 'overwrite',
            listeners: {
                'change' : function(){
                    var environmentField = this.findParentByType('form').getForm().findField('environment');
                    environmentField.validate();
                }
            }
        }, {
            xtype: 'checkbox',
            id: 'DBReset',
            name: 'dbreset',
            fieldLabel: Dash.config.deployment.features.dbreset.label,
            inputValue: true,
            hidden: ! Dash.config.deployment.features.dbreset.enabled
        }, {
        	xtype: 'combobox',
            id: 'ContentCombo',
            name: 'content',
	        fieldLabel: Dash.config.deployment.features.content.label,
	        store: 'Contents',
	        queryMode: 'local',
	        displayField: 'version',
	        valueField: 'id',
	        border: false,
	        forceSelection: true,
	        allowBlank: true,
	        hidden: ! Dash.config.deployment.features.content.enabled,
	        emptyText: Dash.config.deployment.features.content.emptyText
        }, {
	        xtype: 'textfield',
            id: 'Name',
            name: 'name',
            maxLength: 10,
	        fieldLabel: 'Name',
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
            id: 'Deploy',
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
