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
Ext.define('Dash.controller.LockExtension', {
    extend: 'Dash.controller.Base',
    requires: ['Ext.form.field.ComboBox', 'Ext.form.field.Hidden'],
    stores: ['Environments', 'Contents'],
    refs: [{
        selector: 'lockextensionwindow',
        ref: 'lockExtensionWindow'
    }],
    init: function() {
        this.control({
            'environmentgrid': {
                showLockExtensionWindow: this.onShowLockExtensionWindow
            }
        });
        this.control({
            'toptoolbar': {
                hideDeployWindow: this.onHideLockExtensionWindow
            }
        });
        this.control({
            'lockextensionwindow': {
				lockExtension: this.onLockExtension
            }
        });
        this.callParent(arguments);
    },
    onShowLockExtensionWindow: function(environment) {
		if (environment) {
			var window = Ext.create('Dash.view.LockExtensionWindow', {
				environment: environment
			}).show();
		}
    },
	onHideLockExtensionWindow: function() {
        var win = this.getLockExtensionWindow();
		if (win) {
			win.destroy();
		}
    },
    onLockExtension: function(environment, values) {
        if (!environment || !values) {
            return false;
        }
        environment.set('locked', true);
        var now = new Date();
        var lockUntil = new Date(now.getTime() + (values.lock * 3600 * 1000));
        var dateFormat = Dash.config.environment.dateformat;
        environment.set('until', Ext.util.Format.date(lockUntil, dateFormat));
        environment.set('by', values.by);
        environment.save({
            success: this.onLockSaved,
            failure: this.onError,
            scope: this
        });
    },
	onLockSaved: function(environment, operation, success) {
		this.onHideLockExtensionWindow();
	},
    onError: function(response, options) {
		this.onHideLockExtensionWindow();
        this.callParent(arguments);
    }
});
