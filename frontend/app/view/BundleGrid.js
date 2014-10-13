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
Ext.define("Dash.view.BundleGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bundlegrid',
    requires: ['Ext.String', 'Ext.grid.column.Action', 'Ext.window.MessageBox'],
    store: 'Bundles',
    width: '100%',

    id: 'BundleGrid',

    stageStatusIconRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var stageStatus = Dash.app.getController('Bundle').getStageStatus(record, colIndex - 3);
        var iconUrl = Ext.BLANK_IMAGE_URL;
        var iconCls = '';
        if (stageStatus) {
            iconUrl = Ext.String.format(Dash.config.stagestatus.iconpath, stageStatus.get('icon'));
            iconCls = stageStatus.get('cls');
        }
        this.columns[colIndex].items[0].icon = iconUrl;
        this.columns[colIndex].items[0].iconCls = iconCls;
    },

    deploymentActionRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var ctrl = Dash.app.getController('Deployment');
        this.columns[colIndex].items[0].iconCls =
            ctrl.deploymentAllowed(record) ? '' : this.disabledCls;
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
        this.columns = [{
            text: 'Erzeugt',
            dataIndex: 'timestamp',
            type: 'date',
            renderer: Ext.util.Format.dateRenderer(Dash.config.bundlegrid.dateformat),
            width: 180
        }, {
            text: 'Committer',
            dataIndex: 'committer',
            width: 120
        }, {
            text: 'Revision',
            dataIndex: 'revision',
            renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                return ( Dash.config.bundlegrid.vcslink && Dash.config.bundlegrid.vcslink != '' )
                    ? Ext.String.format(Dash.config.bundlegrid.vcslink, record.get('revision'))
                    : record.get('revision');
            },
            width: 90
        }, {
            text: 'Bundle',
            menuText: 'Bundle',
            dataIndex: 'id',
            renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                return ( Dash.config.bundlegrid.repolink && Dash.config.bundlegrid.repolink != '' )
                    ? Ext.String.format(Dash.config.bundlegrid.repolink, record.get('branch'), record.get('id'))
                    : record.get('id');
            },
            width: 120
        }, {
            text: '1st',
            menuText: '1st',
            dataIndex: 'stage1',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent(
                        'loadJobResult',
                        record,
                        1,
                        that.createJobResultTooltip(event.target, record, 1)
                    );
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
            text: '2nd',
            menuText: '2nd',
            dataIndex: 'stage2',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent(
                        'loadJobResult',
                        record,
                        2,
                        that.createJobResultTooltip(event.target, record, 2)
                    );
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
            text: '3rd',
            menuText: '3rd',
            dataIndex: 'stage3',
            align: 'center',
            xtype: 'actioncolumn',
            items: [{
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent(
                        'loadJobResult',
                        record,
                        3,
                        that.createJobResultTooltip(event.target, record, 3)
                    );
                }
            }],
            renderer: this.stageStatusIconRenderer,
            scope: this,
            width: 40
        }, {
			text: 'Build',
			menuText: 'Build',
			align: 'center',
			xtype: 'actioncolumn',
			width: 120,
			items: [{
				margin: 10,
				tooltip: "Build neustarten",
				icon: Dash.config.bundlegrid.icon.restartBuild,
				isDisabled: function (gridview, rowIndex, colIndex, item, record) {
					return record.isBuildRunning();
				},
				handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    Ext.MessageBox.confirm(
                        'Build neustarten',
                        Ext.String.format("Wollen Sie den Build für Revision '{0}' im Branch '{1}' wirklich neustarten?\nDer Build wird eventuell später gestartet und erscheint erst dann auf dem Dashboard.", record.get('revision'), record.get('branch')),
                        function (btn) {
                            if (btn == 'yes') {
                                that.fireEvent('restartBuild', record);
                            }
                        }
                    );
				}
			}, {
				margin: 10,
				tooltip: "Build stoppen",
				icon: Dash.config.bundlegrid.icon.stopBuild,
				isDisabled: function (gridview, rowIndex, colIndex, item, record) {
					return !record.isBuildRunning();
				},
				handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    Ext.MessageBox.confirm(
                        'Build stoppen',
                        Ext.String.format("Wollen Sie den Build für Revision '{0}' im Branch '{1}' wirklich stoppen?", record.get('revision'), record.get('branch')),
                        function (btn) {
                            if (btn == 'yes') {
                                that.fireEvent('stopBuild', record);
                            }
                        }
                    );
				}
			}, {
				margin: 10,
				tooltip: "Build anzeigen",
				icon: Dash.config.bundlegrid.icon.showBuild,
				isDisabled: function (gridview, rowIndex, colIndex, item, record) {
					return !Ext.isDefined(record.getLatestBuildUrl());
				},
				handler: function(gridview, rowIndex, colIndex, item, event, record) {
					that.fireEvent('showBuild', record);
				}
			}],
			scope: this
		}, {
            text: 'Änderungen',
			menuText: 'Änderungen',
            align: 'center',
            xtype: 'actioncolumn',
            width: 120,
            items: [{
                icon: Dash.config.bundlegrid.icon.change,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideAllTooltips');
                    that.fireEvent(
                        'loadChanges',
                        record,
                        that.createChangeTooltip(event.target, record)
                    );
                }
            }]
        }, {
            text: 'Deployment',
            xtype: 'actioncolumn',
            width: 60,
            flex: 1,
            items: [{
                disabled: !Dash.config.bundlegrid.deployment.enabled,
                icon: Dash.config.bundlegrid.icon.deploy,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideEnvironmentsWindow');
                    that.fireEvent('showDeployWindow', record);
                }
            }],
            renderer: this.deploymentActionRenderer,
            scope: this
        }];
        this.callParent(arguments);
    }
});
