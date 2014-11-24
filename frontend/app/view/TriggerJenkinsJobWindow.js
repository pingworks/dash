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
Ext.define("Dash.view.TriggerJenkinsJobWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.triggerjenkinsjobwindow',
    requires: ['Ext.form.Panel'],

    id: 'TriggerJenkinsJobWindow',
    title: Dash.config.triggerJenkinsJob.title,
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
                    xtype: 'form',
                    items: []
                }
            ],
            bbar: ['->', {
                xtype: 'button',
                id: 'Cancel',
                text: Dash.config.triggerJenkinsJob.label.cancel,
                handler: function(button, event) {
                    button.findParentByType('window').destroy();
                }
            }, {
                xtype: 'button',
                id: 'Run',
                text: Dash.config.triggerJenkinsJob.label.run,
                handler: function(button, event) {
                    var form = button.findParentByType('form');
                    var window = button.findParentByType('window');
                    if (form.isValid()) {
                        window.fireEvent('triggerJenkinsJob', window.bundle, form.getValues());
                    }
                }
            }]
        }
    ],

    initComponent: function() {
        var that = this;
        that.items[0].items = [
            {
                xtype: 'panel',
                html: Dash.config.triggerJenkinsJob.text
            }
        ];
        Ext.each(Dash.config.triggerJenkinsJob.inputFields, function(fieldConfig) {
            boxLabel = Ext.String.format(fieldConfig.label, that.bundle.get(fieldConfig.labelBundleKey), that.bundle.get('payload')[fieldConfig.labelBundleKey]);
            that.items[0].items.push({
                xtype: fieldConfig.type,
                boxLabel: boxLabel,
                name: fieldConfig.name,
                inputValue: fieldConfig.value
            });
        });
        this.callParent(arguments);
    }
});
