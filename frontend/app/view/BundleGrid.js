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
    requires: 'Ext.grid.column.Action',
    store: 'Bundles',
    width: '100%',
    
    id: 'BundleGrid',
    
    stageStatusIconRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var stageStatus = Dash.app.getController('Bundle').getStageStatus(record, colIndex - 4);
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
            ctrl.deploymentAllowed(record) ? '' : 'x-item-disabled';
    },
    
    triggerJenkinsJobActionRenderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
        var ctrl = Dash.app.getController('TriggerJenkinsJob');
        this.columns[colIndex].items[0].iconCls = 
            ctrl.triggerJenkinsJobAllowed(record) ? '' : 'x-item-disabled';
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
            text: Dash.config.bundlegrid.label.timestamp,
            dataIndex: 'timestamp',
            type: 'date',
            renderer: Ext.util.Format.dateRenderer(Dash.config.bundlegrid.dateformat),
            width: Dash.config.bundlegrid.colwidth.timestamp,
            hidden: Dash.config.bundlegrid.hidden.timestamp
        }, {
            text: Dash.config.bundlegrid.label.committer,
            dataIndex: 'committer',
            width: Dash.config.bundlegrid.colwidth.committer,
            hidden: Dash.config.bundlegrid.hidden.committer
        }, {
            text: Dash.config.bundlegrid.label.revision,
            dataIndex: 'revision',
            renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                return ( Dash.config.bundlegrid.vcslink && Dash.config.bundlegrid.vcslink != ''  && record.get('revision') != 'Unavailable')
                    ? Ext.String.format(Dash.config.bundlegrid.vcslink, record.get('repository'), record.get('revision'))
                    : record.get('revision');
            },
            width: Dash.config.bundlegrid.colwidth.revision,
            hidden: Dash.config.bundlegrid.hidden.revision
        }, {
            text: Dash.config.bundlegrid.label.repository,
            dataIndex: 'repository',
            renderer: function(value, metadata, record, rowIndex, colIndex, store, view) {
                return ( Dash.config.bundlegrid.vcsrepolink && Dash.config.bundlegrid.vcsrepolink != '' && record.get('repository') != 'Unavailable')
                    ? Ext.String.format(Dash.config.bundlegrid.vcsrepolink, record.get('repository'), record.get('revision'))
                    : record.get('repository');
            },
            width: Dash.config.bundlegrid.colwidth.repository,
            hidden: Dash.config.bundlegrid.hidden.repository
        }, {
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
        }, {
            text: Dash.config.bundlegrid.label.stage1,
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
            width: Dash.config.bundlegrid.colwidth.stage1,
            hidden: Dash.config.bundlegrid.hidden.stage1
        }, {
            text: Dash.config.bundlegrid.label.stage2,
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
            width: Dash.config.bundlegrid.colwidth.stage2,
            hidden: Dash.config.bundlegrid.hidden.stage2
        }, {
            text: Dash.config.bundlegrid.label.stage3,
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
            width: Dash.config.bundlegrid.colwidth.stage3,
            hidden: Dash.config.bundlegrid.hidden.stage3
        }, {
            text: Dash.config.bundlegrid.label.changes,
            menuText: 'Änderungen',
            align: 'center',
            xtype: 'actioncolumn',
            width: Dash.config.bundlegrid.colwidth.changes,
            hidden: Dash.config.bundlegrid.hidden.changes,
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
            text: Dash.config.bundlegrid.label.deployment,
            xtype: 'actioncolumn',
            width: Dash.config.bundlegrid.colwidth.deployment,
            hidden: Dash.config.bundlegrid.hidden.deployment,
            flex: 1,
            items: [{
                disabled: !Dash.config.bundlegrid.deployment.enabled,
                icon: Dash.config.bundlegrid.icon.deploy,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideEnvironmentsWindow');
                    that.fireEvent('hideTriggerJenkinsJobWindow');
                    that.fireEvent('showDeployWindow', record);
                }
            }],
            renderer: this.deploymentActionRenderer,
            scope: this
        }, {
            text: Dash.config.bundlegrid.label.triggerJenkinsJob,
            xtype: 'actioncolumn',
            width: Dash.config.bundlegrid.colwidth.triggerJenkinsJob,
            hidden: Dash.config.bundlegrid.hidden.triggerJenkinsJob,
            flex: 1,
            items: [{
                disabled: !Dash.config.bundlegrid.triggerJenkinsJob.enabled,
                icon: Dash.config.bundlegrid.icon.deploy,
                handler: function(gridview, rowIndex, colIndex, item, event, record) {
                    that.fireEvent('hideEnvironmentsWindow');
                    that.fireEvent('hideDeployWindow');
                    that.fireEvent('showTriggerJenkinsJobWindow', record);
                }
            }],
            renderer: this.deploymentActionRenderer,
            scope: this
        }];
        this.callParent(arguments);
    }
});