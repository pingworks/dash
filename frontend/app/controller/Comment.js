/*
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