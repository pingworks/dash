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
Ext.onReady(function() {
    Ext.application({
        name: 'Dash',
        models: [
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