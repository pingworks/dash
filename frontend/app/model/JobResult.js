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

