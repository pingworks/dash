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
Ext.define('Dash.controller.JobResult', {
    extend: 'Dash.controller.Base',
    stores: ['JobResults'],
    refs: [{
        selector: 'bundlegrid',
        ref: 'bundleGrid'
    }],
    init: function() {
        this.control({
            'bundlegrid': {
                loadJobResult: this.onLoadJobResult
            }
        });
        this.callParent(arguments);
    },
    onLoadJobResult: function(bundle, stage, tooltip) {
        this.getBundleGrid().on('hideAllTooltips', function() {
            tooltip.destroy();
        });
        this.getJobResultsStore().load({
            params: { 
                bundle: bundle.get('id'),
                branch: bundle.get('branch'),
                stage: stage
            },
            scope: tooltip,
            callback: tooltip.onLoad 
        });
    }
});