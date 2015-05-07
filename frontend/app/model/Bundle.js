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

var bundleFields = [
    { name: 'id', type: 'string' },
    { name: 'branch', type: 'string' },
    { name: 'branch_name', type: 'string' },
    { name: 'pname', type: 'string' },
    { name: 'revision', type: 'string' },
    { name: 'repository', type: 'string' }
];
for (var i = 1; i <= Dash.config.pipelineStages; i++) {
    bundleFields.push({ name: 'stage' + i, type: 'int' });
}
bundleFields.push({ name: 'timestamp', type: 'date', convert: function(value, record) {
    return Ext.Date.parse(value, Dash.config.bundle.dateformat)
}});
bundleFields.push({ name: 'buildUrls', type: 'auto' });
bundleFields.push({ name: 'committer', type: 'string' });
bundleFields.push({ name: 'payload', type: 'array' });
bundleFields.push({ name: 'comment', type: 'string' });

Ext.define('Dash.model.Bundle', {
    extend: 'Ext.data.Model',

    fields: bundleFields,
    proxy: {
        type: 'rest',
        url: Dash.config.bundle.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    hasBuild: function() {
        return Ext.isDefined(this.get('buildUrls'));
    },
    getLatestBuildUrl: function() {
        var buildUrls = this.get('buildUrls');
        var lastIndex = buildUrls.length - 1;
        if (lastIndex < 0) {
            return undefined;
        } else {
            return buildUrls[lastIndex];
        }
    },
    isBuildRunning: function() {
        var isBuilding = false;
        if (this.hasBuild()) {
            for (var stage = 1; stage <= 3 && !isBuilding; stage++) {
                var stageStatus = this.getStage(stage);
                if (stageStatus == 1) {
                    isBuilding = true;
                }
            }
        }
        return isBuilding;
    },
    getStage: function(stage) {
        return this.get('stage' + stage);
    },
    getStageStatus: function(stage) {
        var stageStatus = this.getStage(stage);
        return Ext.StoreMgr.get('StageStatus').getById(stageStatus);
    },
    getBranch: function() {
        return Ext.StoreMgr.get('Branches').getById(this.get('branch'));
    }
});
