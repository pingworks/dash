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
var Dash = {};

Dash.config = {
    toolbar: {
        left: [
            {
                id: 'Logo',
                xtype: 'component',
                width: 48,
                height: 38,
                html: '<img src="resources/img/icons/Dashboard-green.png" />'
            },
            {
                xtype: 'component',
                html: '&nbsp;',
                width: 10
            },
            {
                id: 'Title',
                xtype: 'component',
                html: 'Dashboard',
                style: 'font-size: 32px'
            }
        ],
        links: [
            {
                id: 'JenkinsButton',
                text: 'Jenkins',
                url: 'https://dash.pingworks.net/jenkins/'
            },
            {
                id: 'RepoButton',
                text: 'Repo',
                url: 'https://dash.pingworks.net/repo/'
            },
            {
                id: 'EnvButton',
                text: 'Environments',
                handler: function() {
                    this.findParentByType('toolbar').fireEvent('hideCommentWindow');
                    this.findParentByType('toolbar').fireEvent('hideDeployWindow');
                    this.findParentByType('toolbar').fireEvent('showEnvironmentsWindow');
                }
            }
        ]
    },

    bundlegrid: {
        title: 'Bundles in Branch: {0}',
        dateformat: 'd.m.Y H:i:s',
        icon: {
            change: 'resources/img/icons/change.png',
            deploy: 'resources/img/icons/deploy.png',
            comment: 'resources/img/icons/comment.png',
            lockExtension: 'resources/img/icons/lockExtension.png',
            restartBuild: 'resources/img/icons/restartBuild.png',
            stopBuild: 'resources/img/icons/stopBuild.png',
            showBuild: 'resources/img/icons/showBuild.png'
        },
        repolink: '<a href="https://dash.pingworks.net/repo/{0}/{1}" target="_blank" style="color: black">{1}</a>',
        vcslink: '<a href="https://dash.pingworks.net/git/?p=dash.git;a=commit;h={1}" target="_blank" style="color: black">{1}</a>',
        vcsrepolink: '<a href="https://dash.pingworks.net/git/?p={0}.git" target="_blank" style="color: black">{0}</a>',
        sort: {
            field: 'timestamp',
            dir: 'DESC'
        },
        reload: 300000, // 5 min
        deployment: {
            enabled: true,
            required: {
                field: 'stage1',
                value: 3
            }
        },
        triggerJenkinsJob: {
            enabled: true,
            required: {
                field: 'stage1',
                value: 3
            }
        },
        colwidth: {
            timestamp: 180,
            committer: 120,
            revision: 90,
            repository: 90,
            bundle: 120,
            stage1: 40,
            stage2: 40,
            stage3: 40,
            build: 120,
            changes: 120,
            deployment: 60,
            triggerJenkinsJob: 60,
            editComment: 60,
            comment: 60
        },
        label: {
            timestamp: 'Created',
            committer: 'Committer',
            revision: 'CommitId',
            repository: 'VCS',
            bundle: 'Bundle',
            stage1: '1st',
            stage2: '2nd',
            stage3: '3rd',
            build: 'Build',
            changes: 'Changes',
            deployment: 'Deploy Test',
            triggerJenkinsJob: 'Deploy Prod',
            editComment: 'Edit Comment',
            comment: 'Comment'
        },
        hidden: {
            timestamp: false,
            committer: false,
            revision: false,
            repository: true,
            bundle: false,
            stage1: false,
            stage2: false,
            stage3: false,
            build: true,
            changes: false,
            deployment: false,
            triggerJenkinsJob: false,
            editComment: true,
            comment: true
        },
        flex: {
            deployment: 1,
            triggerJenkinsJob: 1,
            comment: 0
        }
    },

    environmentgrid: {
        dateformat: 'd.m.Y H:i:s',
        envlink: '<a href="{0}" target="_blank" style="color: black">{1}</a>'
    },

    branch: {
        endpoint: '/branch'
    },

    bundle: {
        endpoint: '/bundle',
        dateformat: 'Y-m-d_H:i:s'
    },

    comment: {
        endpoint: '/comment'
    },

    change: {
        endpoint: '/change',
        title: 'Changes in Bundle {0}'
    },

    content: {
        endpoint: '/content'
    },

    stagestatus: {
        iconpath: 'resources/img/icons/status/{0}',
        data: [
            {
                'id': 0,
                'name': 'not running',
                'cls': 'unknown',
                'icon': 'grey.png'
            },
            {
                'id': 1,
                'name': 'in progress',
                'cls': 'inprogress',
                'icon': 'green-ani.gif'
            },
            {
                'id': 2,
                'name': 'failed',
                'cls': 'failed',
                'icon': 'red.png'
            },
            {
                'id': 3,
                'name': 'success',
                'cls': 'success',
                'icon': 'green.png'
            }
        ]
    },

    jobstatus: {
        iconpath: 'resources/img/icons/status/{0}',
        data: [
            {
                'id': '-',
                'name': 'not running',
                'cls': 'unknown',
                'icon': 'grey.png'
            },
            {
                'id': 'UNSTABLE',
                'name': 'unstable',
                'cls': 'unstable',
                'icon': 'yellow.png'
            },
            {
                'id': 'FAILURE',
                'name': 'failed',
                'cls': 'failed',
                'icon': 'red.png'
            },
            {
                'id': 'SUCCESS',
                'name': 'success',
                'cls': 'success',
                'icon': 'green.png'
            }
        ]
    },

    jobresult: {
        endpoint: '/jobresult',
        text: '<div style="white-space: nowrap;"><img src="{6}" alt="{2}" class="{7}">&nbsp;'
            + '<a href="https://dash.pingworks.net/jenkins/{1}" target="_blank">{0}</a>: Tests: {3}, skipped: {4}, failed: {5}</div>',
        title: '{1} stage Jobs for Bundle {2}',
        stageMap: {
            1: 'First',
            2: 'Second',
            3: 'Third'
        }
    },

    environment: {
        endpoint: '/environment',
        dateformat: 'Y-m-d H:i:s'
    },

    deployment: {
        build: {
            triggerRestartUrl: '/jenkins/job/Deployment/buildWithParameters?token=Aezei3oph9xu',
            triggerStopUrlPathSuffix: 'stop'
        },
        triggerUrl: '/jenkins/job/Deployment/buildWithParameters?token=Omi7foh4gu7d',
        showUrl: '/jenkins/job/Deployment/',
        features: {
            content: {
                enabled: false,
                label: 'Content',
                emptyText: 'no deployment this time'
            },
            dbreset: {
                enabled: false,
                label: 'Database Reset'
            }
        }
    },

    triggerJenkinsJob: {
        triggerUrl: '/jenkins/job/DeploymentProd/buildWithParameters?token=Omi7foh4gu7d',
        showUrl: '/jenkins/job/DeploymentProd/',
        title: 'Deployment to production',
        label: {
            cancel: 'Cancel',
            run: 'Go go go !!'
        },
        text: 'Do you really want to deploy to production?',
        inputFields: [/*{
         type: 'checkbox',
         label: 'Module 1: {1}',
         labelBundleKey: 'foo',
         name: 'module1',
         value: 'module1'
         }, {
         type: 'checkbox',
         label: 'Module 2: {1}',
         labelBundleKey: 'bar',
         name: 'module2',
         value: 'module2'
         }*/],
        params: {
            bundle: {
                name: 'bundle',
                value: '{1}'
            },
            formValues: {
                name: 'formValues'
            }
        }
    },

    lockduration: {
        data: [
            {
                'id': '1',
                'name': '1 hour'
            },
            {
                'id': '2',
                'name': '2 hours'
            },
            {
                'id': '4',
                'name': '4 hours'
            },
            {
                'id': '8',
                'name': '8 hours'
            },
            {
                'id': '24',
                'name': '1 day'
            },
            {
                'id': '48',
                'name': '2 days'
            },
            {
                'id': '120',
                'name': '5 days'
            }
        ]
    },

    error: {
        title: 'Error',
        msg: 'Unable to read data from server.'
    }

}
