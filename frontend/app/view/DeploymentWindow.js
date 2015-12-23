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
Ext.define("Dash.view.DeploymentWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.deploymentwindow',
    requires: ['Ext.form.Panel', 'Ext.form.Checkbox'],

    id: 'DeploymentWindow',
    title: 'Deployment',
    width: 600,
    items: [
        {
            xtype: 'form',
            border: false,
            padding: 10,
            defaults: {
                width: 550,
                labelWidth: 150
            },
            items: [
                {
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
                },
                {
                    xtype: 'checkbox',
                    id: 'LockOverwrite',
                    name: 'overwrite',
                    fieldLabel: 'Lock überschreiben',
                    inputValue: 'overwrite',
                    checked: true,
                    listeners: {
                        'change': function() {
                            var environmentField = this.findParentByType('form').getForm().findField('environment');
                            environmentField.validate();
                        }
                    }
                },
                {
                    xtype: 'checkbox',
                    id: 'DBReset',
                    name: 'dbreset',
                    fieldLabel: Dash.config.deployment.features.dbreset.label,
                    inputValue: true,
                    hidden: !Dash.config.deployment.features.dbreset.enabled
                },
                {
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
                    hidden: !Dash.config.deployment.features.content.enabled,
                    emptyText: Dash.config.deployment.features.content.emptyText
                },
                {
                    xtype: 'textfield',
                    id: 'Name',
                    name: 'name',
                    maxLength: 10,
                    fieldLabel: 'Name',
                    allowBlank: false,
                    value: 'anonymous'
                },
                {
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
                    value: 86700,
                    listConfig: {
                        id: 'LockList'
                    }
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                id: 'Cancel',
                text: 'Abbrechen',
                handler: function(button, event) {
                    button.findParentByType('window').destroy();
                }
            }, {
                xtype: 'button',
                id: 'Deploy',
                text: 'Deploy',
                handler: function(button, event) {
                    var form = button.findParentByType('form');
                    var window = button.findParentByType('window');
                    if (form.isValid()) {
                        window.fireEvent('deployment', window.bundle, form.getValues());
                    }
                }
            }]
        }
    ]
});
