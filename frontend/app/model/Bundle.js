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
Ext.define('Dash.model.Bundle', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'branch', type: 'string' },
        { name: 'revision', type: 'string' },
        { name: 'repository', type: 'string' },
        { name: 'stage1', type: 'int' },
        { name: 'stage2', type: 'int' },
        { name: 'stage3', type: 'int' },
        { name: 'timestamp', type: 'date', convert: function(value, record) {
            return Ext.Date.parse(value, Dash.config.bundle.dateformat)
        }},
        { name: 'buildUrls', type: 'auto' },
        { name: 'committer', type: 'string' },
        { name: 'payload', type: 'array' },
        { name: 'comment', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.bundle.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
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
        var buildUrls = this.get('buildUrls');
        var isBuilding = false;
        for (var stage = 1; stage <= 3 && !isBuilding; stage++) {
            var stageStatus = this.getStage(stage);
            if (stageStatus == 1) {
                isBuilding = true;
            }
        }
        return Ext.isDefined(buildUrls) && isBuilding;
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

