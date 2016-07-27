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
Ext.define("Dash.view.BundleGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bundlegrid',
    requires: ['Ext.String', 'Ext.grid.column.Action', 'Ext.window.MessageBox'],
    store: 'Bundles',
    width: '100%',

    id: 'BundleGrid',

    stageColumnOffset: 6,

    visibleColumnIndex: function (colIndex) {
        // work around extjs bug: colIndex is wrong when some cols are hidden
        var hiddenCols = 0;
        for (var i = 0; i < colIndex; i++) {
            if (!this.columns[i].isVisible())
                hiddenCols++;
        }
        return colIndex + hiddenCols;
    },

    getStageNrFromColIndex: function(colIndex) {
        return this.visibleColumnIndex(colIndex) - this.stageColumnOffset;
    },

    stageStatusIconRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {

        var stageStatus = Dash.app.getController('Bundle').getStageStatus(record, this.getStageNrFromColIndex(colIndex));
        var iconUrl = Ext.BLANK_IMAGE_URL;
        var iconCls = '';
        if (stageStatus) {
            iconUrl = Ext.String.format(Dash.config.stagestatus.iconpath, stageStatus.get('icon'));
            iconCls = stageStatus.get('cls');
        }
        this.columns[this.visibleColumnIndex(colIndex)].items[0].icon = iconUrl;
        this.columns[this.visibleColumnIndex(colIndex)].items[0].iconCls = iconCls;
    },

    deploymentActionRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var ctrl = Dash.app.getController('Deployment');
        this.columns[this.colIndexDeployment].items[0].iconCls =
            ctrl.deploymentAllowed(record) ? '' : this.disabledCls;
    },

    triggerJenkinsJobActionRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var ctrl = Dash.app.getController('TriggerJenkinsJob');
        this.columns[this.colIndexTriggerJenkinsJob].items[0].iconCls =
            ctrl.triggerJenkinsJobAllowed(record) ? '' : this.disabledCls;
    },

    createChangeTooltip: function(target, bundle) {
        return Ext.create('Dash.view.ChangeToolTip', {
            id: 'TTC-' + bundle.get('id').replace(/\./g, '-'),
            target: target
        });
    },

    createJobResultTooltip: function(target, bundle, stage) {
        return Ext.create('Dash.view.JobResultToolTip', {
            id: 'TTJR-' + bundle.get('id').replace(/\./g, '-') + '-' + stage,
            target: target
        });
    },

    initComponent: function() {
        var that = this;
        this.columns = [
            {
                text: Dash.config.bundlegrid.label.timestamp,
                dataIndex: 'timestamp',
                type: 'date',
                renderer: Ext.util.Format.dateRenderer(Dash.config.bundlegrid.dateformat),
                width: Dash.config.bundlegrid.colwidth.timestamp,
                hidden: Dash.config.bundlegrid.hidden.timestamp
            },
            {
                text: Dash.config.bundlegrid.label.committer,
                dataIndex: 'committer',
                width: Dash.config.bundlegrid.colwidth.committer,
                hidden: Dash.config.bundlegrid.hidden.committer
            },
            {
                text: Dash.config.bundlegrid.label.pname,
                dataIndex: 'pname',
                width: Dash.config.bundlegrid.colwidth.pname,
                hidden: Dash.config.bundlegrid.hidden.pname
            },
            {
                text: Dash.config.bundlegrid.label.branch,
                dataIndex: 'branch_name',
                width: Dash.config.bundlegrid.colwidth.branch,
                hidden: Dash.config.bundlegrid.hidden.branch
            },
            {
                text: Dash.config.bundlegrid.label.revision,
                dataIndex: 'revision',
                renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                    return ( Dash.config.bundlegrid.vcslink && Dash.config.bundlegrid.vcslink != '' && record.get('revision') != 'Unavailable')
                        ? Ext.String.format(Dash.config.bundlegrid.vcslink, record.get('repository'), record.get('revision'), record.get('branch'))
                        : record.get('revision');
                },
                width: Dash.config.bundlegrid.colwidth.revision,
                hidden: Dash.config.bundlegrid.hidden.revision
            },
            {
                text: Dash.config.bundlegrid.label.repository,
                dataIndex: 'repository',
                renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                    return ( Dash.config.bundlegrid.vcsrepolink && Dash.config.bundlegrid.vcsrepolink != '' && record.get('repository') != 'Unavailable')
                        ? Ext.String.format(Dash.config.bundlegrid.vcsrepolink, record.get('repository'), record.get('revision'))
                        : record.get('repository');
                },
                width: Dash.config.bundlegrid.colwidth.repository,
                hidden: Dash.config.bundlegrid.hidden.repository
            },
            {
                text: Dash.config.bundlegrid.label.bundle,
                menuText: 'Bundle',
                dataIndex: 'id',
                renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                    return ( Dash.config.bundlegrid.repolink && Dash.config.bundlegrid.repolink != '' )
                        ? Ext.String.format(Dash.config.bundlegrid.repolink, record.get('branch'), record.get('id'))
                        : record.get('id');
                },
                width: Dash.config.bundlegrid.colwidth.bundle,
                hidden: Dash.config.bundlegrid.hidden.bundle
            }
        ];
        for (var i = 1; i <= Dash.config.pipelineStages; i++) {
            this.columns.push({
                text: Dash.config.bundlegrid.label['stage' + i],
                menuText: i,
                dataIndex: 'stage' + i,
                align: 'center',
                xtype: 'actioncolumn',
                items: [
                    {
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            var stage = this.getStageNrFromColIndex(colIndex);
                            that.fireEvent('hideAllTooltips');
                            that.fireEvent(
                                'loadJobResult',
                                record,
                                stage,
                                that.createJobResultTooltip(event.target, record, stage)
                            );
                        }
                    }
                ],
                renderer: this.stageStatusIconRenderer,
                scope: this,
                width: Dash.config.bundlegrid.colwidth['stage' + i],
                hidden: Dash.config.bundlegrid.hidden['stage' + i]
            });
        }
        var cols = [
            {
                text: Dash.config.bundlegrid.label.build,
                menuText: 'Build',
                align: 'center',
                xtype: 'actioncolumn',
                width: Dash.config.bundlegrid.colwidth.build,
                hidden: Dash.config.bundlegrid.hidden.build,
                items: [
                    {
                        margin: 10,
                        tooltip: "Build neustarten",
                        icon: Dash.config.bundlegrid.icon.restartBuild,
                        isDisabled: function(gridview, rowIndex, colIndex, item, record) {
                            return record.isBuildRunning();
                        },
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            Ext.MessageBox.confirm(
                                'Build neustarten',
                                Ext.String.format("Wollen Sie den Build für Revision '{0}' im Branch '{1}' wirklich neustarten?\nDer Build wird eventuell später gestartet und erscheint erst dann auf dem Dashboard.", record.get('revision'), record.get('branch')),
                                function(btn) {
                                    if (btn == 'yes') {
                                        that.fireEvent('restartBuild', record);
                                    }
                                }
                            );
                        }
                    },
                    {
                        margin: 10,
                        tooltip: "Build stoppen",
                        icon: Dash.config.bundlegrid.icon.stopBuild,
                        isDisabled: function(gridview, rowIndex, colIndex, item, record) {
                            return !record.isBuildRunning();
                        },
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            Ext.MessageBox.confirm(
                                'Build stoppen',
                                Ext.String.format("Wollen Sie den Build für Revision '{0}' im Branch '{1}' wirklich stoppen?", record.get('revision'), record.get('branch')),
                                function(btn) {
                                    if (btn == 'yes') {
                                        that.fireEvent('stopBuild', record);
                                    }
                                }
                            );
                        }
                    },
                    {
                        margin: 10,
                        tooltip: "Build anzeigen",
                        icon: Dash.config.bundlegrid.icon.showBuild,
                        isDisabled: function(gridview, rowIndex, colIndex, item, record) {
                            return !Ext.isDefined(record.getLatestBuildUrl());
                        },
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            that.fireEvent('showBuild', record);
                        }
                    }
                ],
                scope: this
            },
            {
                text: Dash.config.bundlegrid.label.changes,
                menuText: 'Änderungen',
                align: 'center',
                xtype: 'actioncolumn',
                width: Dash.config.bundlegrid.colwidth.changes,
                hidden: Dash.config.bundlegrid.hidden.changes,
                items: [
                    {
                        icon: Dash.config.bundlegrid.icon.change,
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            that.fireEvent('hideAllTooltips');
                            that.fireEvent(
                                'loadChanges',
                                record,
                                that.createChangeTooltip(event.target, record)
                            );
                        }
                    }
                ]
            },
            {
                id: 'ColumnDeployment',
                text: Dash.config.bundlegrid.label.deployment,
                xtype: 'actioncolumn',
                width: Dash.config.bundlegrid.colwidth.deployment,
                hidden: Dash.config.bundlegrid.hidden.deployment,
                flex: Dash.config.bundlegrid.flex.deployment,
                items: [
                    {
                        disabled: !Dash.config.bundlegrid.deployment.enabled,
                        icon: Dash.config.bundlegrid.icon.deploy,
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            that.fireEvent('hideEnvironmentsWindow');
                            that.fireEvent('hideTriggerJenkinsJobWindow');
                            that.fireEvent('showDeployWindow', record);
                        }
                    }
                ],
                renderer: this.deploymentActionRenderer,
                scope: this
            },
            {
                id: 'ColumnTriggerJenkinsJob',
                text: Dash.config.bundlegrid.label.triggerJenkinsJob,
                xtype: 'actioncolumn',
                width: Dash.config.bundlegrid.colwidth.triggerJenkinsJob,
                hidden: Dash.config.bundlegrid.hidden.triggerJenkinsJob,
                flex: Dash.config.bundlegrid.flex.triggerJenkinsJob,
                items: [
                    {
                        disabled: !Dash.config.bundlegrid.triggerJenkinsJob.enabled,
                        icon: Dash.config.bundlegrid.icon.deploy,
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            that.fireEvent('hideEnvironmentsWindow');
                            that.fireEvent('hideDeployWindow');
                            that.fireEvent('showTriggerJenkinsJobWindow', record);
                        }
                    }
                ],
                renderer: this.triggerJenkinsJobActionRenderer,
                scope: this
            },
            {
                id: 'ColumnEditComment',
                text: Dash.config.bundlegrid.label.editComment,
                menuText: Dash.config.bundlegrid.label.editComment,
                align: 'center',
                xtype: 'actioncolumn',
                hidden: Dash.config.bundlegrid.hidden.editComment,
                width: Dash.config.bundlegrid.colwidth.editComment,
                items: [
                    {
                        icon: Dash.config.bundlegrid.icon.comment,
                        handler: function(gridview, rowIndex, colIndex, item, event, record) {
                            that.fireEvent('showCommentWindow', record);
                        }
                    }
                ]
            },
            {
                id: 'ColumnComment',
                text: Dash.config.bundlegrid.label.comment,
                menuText: Dash.config.bundlegrid.label.comment,
                dataIndex: 'comment',
                hidden: Dash.config.bundlegrid.hidden.comment,
                width: Dash.config.bundlegrid.colwidth.comment,
                flex: Dash.config.bundlegrid.flex.comment,
                renderer: function(text) {
                    return Ext.util.Format.htmlEncode(text);
                }
            }
        ];
        Ext.Array.each(cols, function (el) {
            that.columns.push(el);
        });

        Ext.Array.forEach(this.columns, function(column, index) {
            if (column.id == 'ColumnDeployment')
                this.colIndexDeployment = index;
        }, this);

        Ext.Array.forEach(this.columns, function(column, index) {
            if (column.id == 'ColumnTriggerJenkinsJob')
                this.colIndexTriggerJenkinsJob = index;
        }, this);

        this.callParent(arguments);
    }
});
