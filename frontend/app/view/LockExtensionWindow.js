/*
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
Ext.define("Dash.view.LockExtensionWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.lockextensionwindow',
    requires: ['Ext.form.Panel'],

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
			var data = window.environment.getData();
			window.down('form').getForm().setValues(data);
		}
	}
});
