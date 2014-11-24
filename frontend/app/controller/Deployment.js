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
Ext.define('Dash.controller.Deployment', {
    extend: 'Dash.controller.Base',
    requires: ['Ext.form.field.ComboBox', 'Ext.form.field.Hidden'],
    stores: ['Environments', 'Contents'],
    refs: [
        {
            selector: 'bundlegrid',
            ref: 'bundleGrid'
        },
        {
            selector: 'deploymentwindow',
            ref: 'deploymentWindow'
        }
    ],
    init: function() {
        this.control({
            'bundlegrid': {
                showDeployWindow: this.onShowDeployWindow
            }
        });
        this.control({
            'toptoolbar': {
                hideDeployWindow: this.onHideDeployWindow
            }
        });
        this.control({
            'deploymentwindow': {
                deployment: this.onDeployment
            }
        });
        this.callParent(arguments);
    },
    deploymentAllowed: function(bundle) {
        if (bundle) {
            var requiredFieldValue = bundle.get(Dash.config.bundlegrid.deployment.required.field);
            return ( Dash.config.bundlegrid.deployment.enabled
                && Dash.config.bundlegrid.deployment.required.value == requiredFieldValue);
        }
        return false;
    },
    onShowDeployWindow: function(bundle) {
        if (bundle && this.deploymentAllowed(bundle)) {
            this.getEnvironmentsStore().reload();
            this.getEnvironmentsStore().clearFilter(true);
            this.getEnvironmentsStore().filter('deployable', true);
            if (Dash.config.deployment.features.content && Dash.config.deployment.features.content.enabled)
                this.getContentsStore().reload();
            var window = Ext.create('Dash.view.DeploymentWindow', {
                bundle: bundle
            }).show();
        }
    },
    onHideDeployWindow: function() {
        var win = this.getDeploymentWindow()
        win && win.destroy();
    },
    onDeployment: function(bundle, values) {
        if (!bundle || !values || !values.environment) {
            return false;
        }
        var environment = this.getEnvironmentsStore().findRecord('id', values.environment);
        environment.set('locked', true);
        var now = new Date();
        var lockUntil = new Date(now.getTime() + (values.lock * 3600 * 1000));
        var dateFormat = Dash.config.environment.dateformat;
        environment.set('until', Ext.util.Format.date(lockUntil, dateFormat));
        environment.set('by', values.name);
        environment.set('bundle', bundle.get('id'));
        environment.set('dbreset', values.dbreset);
        environment.set('content', values.content);
        environment.save({
            success: this.onLockSaved,
            failure: this.onError,
            scope: this
        });
    },
    onLockSaved: function(environment, operation, success) {
        Ext.Ajax.request({
            url: Dash.config.deployment.triggerUrl,
            params: {
                environment: environment.get('id'),
                content: environment.get('content'),
                dbreset: environment.get('dbreset'),
                bundle: environment.get('bundle'),
                user: environment.get('by')
            },
            success: this.onDeploymentTriggered,
            failure: this.onDeploymentError,
            scope: this
        });
    },
    onDeploymentTriggered: function(response, options) {
        this.getDeploymentWindow().destroy();
        var window = Ext.create('Ext.window.Window', {
            id: 'DeploymentResultWindow',
            html: '<iframe src="' + Dash.config.deployment.showUrl + '" width="800px", height="600px"/>'
        }).show();
    },
    onDeploymentError: function(response, options) {
        if (response.status == 302) {
            return this.onDeploymentTriggered(response, options);
        }
        if (response.status == 0) {
            return this.onDeploymentTriggered(response, options);
        }
        return this.onError(response, options);
    },
    onError: function(response, options) {
        this.onHideDeployWindow();
        this.callParent(arguments);
    }
});