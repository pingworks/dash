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
Ext.define("Dash.view.TriggerJenkinsJobWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.triggerjenkinsjobwindow',
    requires: ['Ext.form.Panel'],
    
    id: 'TriggerJenkinsJobWindow',
    title: Dash.config.triggerJenkinsJob.title,
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
            xtype: 'form',
            items: []
        }],
        bbar: ['->', {
            xtype: 'button',
            id: 'Cancel',
            text: Dash.config.triggerJenkinsJob.label.cancel,
            handler: function(button, event){
                button.findParentByType('window').destroy();
            }
        }, {
            xtype: 'button',
            id: 'Run',
            text: Dash.config.triggerJenkinsJob.label.run,
            handler: function(button, event){
                var form = button.findParentByType('form');
                var window = button.findParentByType('window');
                if (form.isValid()) {
                    window.fireEvent('triggerJenkinsJob', window.bundle, form.getValues());
                }
            }
        }]
    }],
    
    initComponent: function() {
        var that = this;
        that.items[0].items = [{
            xtype: 'panel',
            html: Dash.config.triggerJenkinsJob.text
        }];
        Ext.each(Dash.config.triggerJenkinsJob.inputFields, function(fieldConfig) {
            that.items[0].items.push({
                xtype: fieldConfig.type,
                boxLabel: fieldConfig.label,
                name: fieldConfig.name,
                inputValue: fieldConfig.value
            });
        });
        this.callParent(arguments);
    }
});
