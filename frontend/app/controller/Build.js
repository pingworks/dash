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
Ext.define('Dash.controller.Build', {
    extend: 'Dash.controller.Base',
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
			'bundlegrid': {
				stopBuild: this.onStopBuild,
				showBuild: this.onShowBuild
            },
		});
        this.callParent(arguments);
    },
	onStopBuild: function(bundle) {
		if (bundle.isBuildRunning()) {
			var stopUrl = bundle.getLatestBuildUrl();
			if (!stopUrl.match('/$')) {
				stopUrl += '/';
			}
			stopUrl += Dash.config.deployment.stopBuildUrlPath
			Ext.Ajax.request({
				url: stopUrl,
				bundle: bundle,
				method: 'POST',
				success: this.onStopBuildTriggered,
				failure: this.onStopBuildError,
				scope: this
			});
		}
    },
	onShowBuild: function (bundle) {
		var buildUrl = bundle.getLatestBuildUrl();
		var window = Ext.create('Ext.window.Window', {
			id: 'StopBuildWindow',
			html: '<iframe src="' + buildUrl + '" width="800px", height="600px"/>'
		});
		window.show();
	},
	onStopBuildTriggered: function(response, options) {
		this.onShowBuild(options.bundle);
	},
	onStopBuildError: function(response, options) {
		if (response.status == 302 || response.status == 0) {
			return this.onStopBuildTriggered(response, options);
		}
		return this.onError(response, options);
	}
});