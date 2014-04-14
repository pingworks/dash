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
            ctrl.deploymentAllowed(record) ? '' : 'x-item-disabled';
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
                branchestore = Ext.StoreMgr.get('Branches');
                branch = branchstore.getById(record.get('branch')).name;
                return ( Dash.config.bundlegrid.repolink && Dash.config.bundlegrid.repolink != '' )
                    ? Ext.String.format(Dash.config.bundlegrid.repolink, branch, record.get('id'))
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
