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
Ext.onReady(function() {
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
            'Environment'
        ],

        launch: function() {
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter('build/reports/'));
            jasmine.getEnv().execute();
        }
    });
});