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
Ext.define("Dash.view.CommentWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.commentwindow',
    requires: ['Ext.form.Panel','Ext.form.field.Text'],

    id: 'CommentWindow',
    title:  Dash.config.comment.title,
    width: 600,
    items: [{
        xtype: 'form',
        border: false,
        padding: 10,
        defaults: {
            width: 550,
            labelWidth: 150
        },
        items: [{
			xtype: 'textfield',
			id: 'Comment',
			name: 'comment',
			fieldLabel: Dash.config.comment.text,
		}],
        bbar: ['->', {
            xtype: 'button',
            id: 'Cancel',
            text: Dash.config.comment.label.cancel,
            handler: function(button, event){
                button.findParentByType('window').destroy();
            }
        }, {
            xtype: 'button',
            id: 'SaveComment',
            text: Dash.config.comment.label.save,
            handler: function(button, event){
                var form = button.findParentByType('form');
                var window = button.findParentByType('window');
                if (form.isValid()) {
                    window.fireEvent('saveComment', window.bundle, form.getValues());
                }
            }
        }]
    }],
	listeners: {
		show: function (window) {
            var bundle = window.bundle;
            window.setTitle(Ext.String.format(Dash.config.comment.title, bundle.get('id')));
			var data = bundle.getData();
			window.down('form').getForm().setValues(data);
		}
	}
});
