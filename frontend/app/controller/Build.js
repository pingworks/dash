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
Ext.define('Dash.controller.Build', {
    extend: 'Dash.controller.Base',
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
			'bundlegrid': {
				restartBuild: this.onRestartBuild,
				stopBuild: this.onStopBuild,
				showBuild: this.onShowBuild
            }
		});
        this.callParent(arguments);
    },
	onRestartBuild: function(bundle) {
		if (!bundle.isBuildRunning()) {
			Ext.Ajax.request({
				url: Dash.config.build.triggerRestartUrl,
				params: {
					BRANCH: bundle.getBranch().get('name'),
					COMMITID: bundle.get('revision')
				},
                failure: this.onError,
				scope: this
			});
		}
	},
	onStopBuild: function(bundle) {
		if (bundle.isBuildRunning()) {
			var stopUrl = bundle.getLatestBuildUrl();
			if (!stopUrl.match('/$')) {
				stopUrl += '/';
			}
			stopUrl += Dash.config.build.triggerStopUrlPathSuffix
			Ext.Ajax.request({
				url: stopUrl,
				bundle: bundle,
				method: 'POST',
				success: this.onStopBuildTriggered,
				failure: this.onError,
				scope: this
			});
		}
    },
	onShowBuild: function (bundle) {
		var buildUrl = bundle.getLatestBuildUrl();
        if (buildUrl) {
            var window = Ext.create('Ext.window.Window', {
                id: 'StopBuildWindow',
                html: '<iframe src="' + buildUrl + '" width="800px", height="600px"/>'
            });
            window.show();
        }
	},
	onStopBuildTriggered: function(response, options) {
		this.onShowBuild(options.bundle);
	}
});