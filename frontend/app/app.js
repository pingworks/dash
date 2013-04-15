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

/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

Ext.BLANK_IMAGE_URL = 'resources/img/s.gif';

Ext.application({
    name: 'Dash',

    models:[
        'Branch',
        'Bundle',
        'Change',
        'JobResult',
        'JobStatus',
        'StageStatus'
    ],

    views: [
        'BundleGrid',
        'ChangeToolTip',
        'JobResultToolTip',
        'StoreMenu',
        'ToolTip',
        'TopToolbar',
        'BottomToolbar',
        'Viewport'
    ],

    stores: [
        'Branches',
        'Bundles',
        'Changes',
        'JobResults',
        'JobStatus',
        'StageStatus'
    ],

    controllers: [
        'Bundle',
        'Change',
        'JobResult'
    ],

    autoCreateViewport: true,
    
    launch: function() {
        this.getBranchesStore().load({
            callback: this.onBranchesLoad,
            scope: this
        });
    },
    onBranchesLoad: function() {
        var branch = this.getBranchesStore().getAt(0).get('id');
        this.getController('Bundle').onLoadBundles(branch);
    }
});
