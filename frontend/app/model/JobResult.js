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
Ext.define('Dash.model.JobResult', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'stage', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'total', type: 'int' },
        { name: 'skipped', type: 'int' },
        { name: 'failed', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.jobresult.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    getJobStatus: function() {
        var jobStatus = Ext.StoreMgr.get('JobStatus').getById(this.get('status'));
        if (!jobStatus)
            jobStatus = Ext.StoreMgr.get('JobStatus').getById('-');
        return jobStatus;
    }
});

