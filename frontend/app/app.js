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

/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

Ext.BLANK_IMAGE_URL = 'resources/img/s.gif';

Ext.application({
    name: 'Dash',

    models:[
        'Branch',
        'Bundle',
        'Content',
        'Change',
        'JobResult',
        'JobStatus',
        'StageStatus',
        'Environment',
        'LockDuration'
    ],

    views: [
        'BundleGrid',
        'ChangeToolTip',
        'JobResultToolTip',
        'ToolTip',
        'TopToolbar',
        'BottomToolbar',
        'DeploymentWindow',
        'TriggerJenkinsJobWindow',
        'EnvironmentsWindow',
        'EnvironmentGrid',
        'Viewport'
    ],

    stores: [
        'Branches',
        'Bundles',
        'Contents',
        'Changes',
        'JobResults',
        'JobStatus',
        'StageStatus',
        'Environments',
        'LockDurations'
    ],

    controllers: [
        'Bundle',
		'Branch',
        'Change',
        'JobResult',
        'Deployment',
        'Environment',
        'TriggerJenkinsJob'
    ],

    autoCreateViewport: true,

    launch: function() {
        this.getBranchController().onLoadBranches({
            callback: this.onBranchesLoad,
            scope: this
        });
    },
    onBranchesLoad: function() {
        var branchIdToLoad = window.location.hash.substring(1);
        if (!branchIdToLoad) {
            branchToLoad = this.getBranchesStore().getAt(0);
        }
        else {
            branchToLoad = this.getBranchesStore().findRecord('id',branchIdToLoad);
        }
        this.getController('Bundle').onLoadBundles(branchToLoad);
    }
});
