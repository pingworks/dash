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
Ext.define('Dash.controller.Deployment', {
    extend: 'Dash.controller.Base',
    requires: ['Ext.form.field.ComboBox', 'Ext.form.field.Hidden'],
    stores: ['Environments', 'Contents'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }, {
        selector: 'deploymentwindow',
        ref: 'deploymentWindow'
    }],
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
        if (values.content != '') {
            environment.set('content', values.content);
        }
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