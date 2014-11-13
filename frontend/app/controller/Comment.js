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
Ext.define('Dash.controller.Comment', {
    extend: 'Dash.controller.Base',
    refs: [{
            selector: 'bundlegrid',
            ref: 'bundleGrid'
        }, {
            selector: 'commentwindow',
            ref: 'commentWindow'
    }],
    init: function () {
        this.control({
            'bundlegrid': {
                showCommentWindow: this.onShowCommentWindow
            }
        });
        this.control({
            'bundlegrid': {
                hideCommentWindow: this.onHideCommentWindow
            },
            'toolbar': {
                hideCommentWindow: this.onHideCommentWindow
            }
        });
        this.control({
            'commentwindow': {
                saveComment: this.onSaveComment
            }
        });
        this.callParent(arguments);
    },
    onShowCommentWindow: function (bundle) {
        if (bundle) {
            var window = Ext.create('Dash.view.CommentWindow', {
                bundle: bundle
            });
            window.show();
        }
    },
    onHideCommentWindow: function () {
        var win = this.getCommentWindow();
        if (win) {
            win.destroy();
        }
    },
    onSaveComment: function (bundle, values) {
        if (!bundle || !values) {
            return false;
        }
        Ext.Ajax.request({
            url: Dash.config.comment.endpoint,
            params: {
                bundle: bundle.get('id'),
                branch: bundle.get('branch'),
                comment: values.comment
            },
            success: this.onCommentSaved,
            scope: this
        });
    },
    onCommentSaved: function (response) {
        var data = Ext.JSON.decode(response.responseText);
        if (data.success) {
            var win = this.getCommentWindow();
            this.onHideCommentWindow();
            if (win) {
                win.fireEvent('loadBundles');
            }
        } else {
            this.onError(response);
        }
    },
    onError: function (response, options) {
        this.onHideCommentWindow();
        this.callParent(arguments);
    }
});