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
        { name: 'timestamp', type: 'date', convert: function(value, record) { return Ext.Date.parse(value, Dash.config.bundle.dateformat)}},
        { name: 'buildUrls', type: 'auto' },
        { name: 'committer', type: 'string' },
        { name: 'payload', type: 'array' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.bundle.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    hasBuild: function () {
        return Ext.isDefined(this.get('buildUrls'));
    },
    getLatestBuildUrl: function () {
        var buildUrls = this.get('buildUrls');
        var lastIndex = buildUrls.length - 1;
        if (lastIndex < 0) {
            return undefined;
        } else {
            return buildUrls[lastIndex];
        }
    },
    isBuildRunning: function () {
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
    getStage: function (stage) {
        return this.get('stage' + stage);
    },
    getStageStatus: function (stage) {
        var stageStatus = this.getStage(stage);
        return Ext.StoreMgr.get('StageStatus').getById(stageStatus);
    },
    getBranch: function () {
        return Ext.StoreMgr.get('Branches').getById(this.get('branch'));
    }
});

