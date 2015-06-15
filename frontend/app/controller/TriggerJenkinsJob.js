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
Ext.define('Dash.controller.TriggerJenkinsJob', {
    extend: 'Dash.controller.Base',
    requires: ['Ext.form.field.ComboBox', 'Ext.form.field.Hidden'],
    stores: ['Environments', 'Contents'],
    refs: [
        {
            selector: 'bundlegrid',
            ref: 'bundleGrid'
        },
        {
            selector: 'triggerjenkinsjobwindow',
            ref: 'triggerJenkinsJobWindow'
        }
    ],
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
            if (Dash.config.bundlegrid.triggerJenkinsJob.required) {
                var requiredFieldValue = bundle.get(Dash.config.bundlegrid.triggerJenkinsJob.required.field);
                return ( Dash.config.bundlegrid.triggerJenkinsJob.enabled
                    && Dash.config.bundlegrid.triggerJenkinsJob.required.value == requiredFieldValue);
            }
            if (Dash.config.bundlegrid.triggerJenkinsJob.conditions) {
                var conditionTrue = true;
                Ext.each(Dash.config.bundlegrid.triggerJenkinsJob.conditions, function(condition) {
                    var field = condition.field;
                    var regex = condition.regex;
                    var fieldValue = '' + bundle.get(field);
                    conditionTrue &= ( Dash.config.bundlegrid.triggerJenkinsJob.enabled
                        && fieldValue.match(regex) != null)
                });
                return conditionTrue;
            }
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
    onTriggerJenkinsJob: function(bundle, formValues) {
        if (!bundle || !formValues) {
            return false;
        }
        var values = Object.keys(formValues).map(function(key) {
            return formValues[key];
        });
        var params = formValues;
        params[Dash.config.triggerJenkinsJob.params.bundle.name] =
            Ext.String.format(Dash.config.triggerJenkinsJob.params.bundle.value, bundle.get('branch'), bundle.get('id'));
        params[Dash.config.triggerJenkinsJob.params.formValues.name] = values.join(';');
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
