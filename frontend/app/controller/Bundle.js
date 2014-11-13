/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
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
Ext.define('Dash.controller.Bundle', {
    extend: 'Dash.controller.Base',
    stores: ['Bundles', 'StageStatus', 'Branches'],
    refs: [
        {
            selector: 'bundlegrid',
            ref: 'bundleGrid'
        }
    ],
    init: function() {
        this.control({
            'toptoolbar': {
                loadBundles: this.onLoadBundles
            },
            'commentwindow': {
                loadBundles: this.onLoadBundles
            }
        });

        // reloadTimer
        var ctrl = this;
        var reloadTask = Ext.TaskManager.start({
            run: function() {
                ctrl.onLoadBundles()
            },
            interval: Dash.config.bundlegrid.reload,
            fireOnStart: false
        });
        this.callParent(arguments);
    },
    onLoadBundles: function(branch) {
        if (branch) {
            this.getBundlesStore().load({
                params: {
                    branch: branch.get('id')
                }
            });
            this.getBundleGrid().setTitle(Ext.String.format(Dash.config.bundlegrid.title, branch.get('name')));
        } else {
            this.getBundlesStore().reload();
        }
        this.getBundleGrid().fireEvent('hideAllTooltips');
    },
    getStageStatus: function(bundle, stage) {
        return bundle.getStageStatus(stage);
    }
});