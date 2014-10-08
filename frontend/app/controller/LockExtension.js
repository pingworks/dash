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