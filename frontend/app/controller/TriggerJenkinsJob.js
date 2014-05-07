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
Ext.define('Dash.controller.TriggerJenkinsJob', {
    extend: 'Dash.controller.Base',
    requires: ['Ext.form.field.ComboBox', 'Ext.form.field.Hidden'],
    stores: ['Environments', 'Contents'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }, {
        selector: 'triggerjenkinsjobwindow',
        ref: 'triggerJenkinsJobWindow'
    }],
    init: function() {
        this.control({
            'bundlegrid': {
                showTriggerJenkinsJobWindow: this.onShowTriggerJenkinsJobWindow
            }
        });
        this.control({
            'toptoolbar': {
                hideTriggerJenkinsJobWindow: this.onHideTriggerJenkinsJobWindow
            }
        });
        this.control({
            'triggerjenkinsjobwindow': {
                triggerJenkinsJob: this.onTriggerJenkinsJob
            }
        });
        this.callParent(arguments);
    },
    triggerJenkinsJobAllowed: function(bundle) {
        if (bundle) {
	        var requiredFieldValue = bundle.get(Dash.config.bundlegrid.triggerJenkinsJob.required.field);
	        return ( Dash.config.bundlegrid.triggerJenkinsJob.enabled 
	            && Dash.config.bundlegrid.triggerJenkinsJob.required.value == requiredFieldValue);
        }
        return false;
    },
    onShowTriggerJenkinsJobWindow: function(bundle) {
        if (bundle && this.triggerJenkinsJobAllowed(bundle)) {
            var window = Ext.create('Dash.view.TriggerJenkinsJobWindow', {
                bundle: bundle
            }).show();
        }
    },
    onHideTriggerJenkinsJobWindow: function() {
        var win = this.getTriggerJenkinsJobWindow()
        win && win.destroy();
    },
    onTriggerJenkinsJob: function(bundle, values) {
        if (!bundle || !values ) {
            return false;
        }
        var params = {};
        params[Dash.config.triggerJenkinsJob.param.name] = 
            Ext.String.format(Dash.config.triggerJenkinsJob.param.value, bundle.get('branch'), bundle.get('id')); 
        Ext.Ajax.request({
            url: Dash.config.triggerJenkinsJob.triggerUrl,
            params: params,
            success: this.onTriggerJenkinsJobTriggered,
            failure: this.onTriggerJenkinsJobError,
            scope: this
        });
    },
    onTriggerJenkinsJobTriggered: function(response, options) {
        this.getTriggerJenkinsJobWindow().destroy();
        var window = Ext.create('Ext.window.Window', {
                id: 'TriggerJenkinsJobResultWindow',
                html: '<iframe src="' + Dash.config.triggerJenkinsJob.showUrl + '" width="800px", height="600px"/>'
            }).show();
    },
    onTriggerJenkinsJobError: function(response, options) {
        if (response.status == 302) {
            return this.onTriggerJenkinsJobTriggered(response, options);
        }
        if (response.status == 0) {
            return this.onTriggerJenkinsJobTriggered(response, options);
        }
        return this.onError(response, options);
    },
    onError: function(response, options) {
        this.onHideTriggerJenkinsJobWindow();
        this.callParent(arguments);
    }
});