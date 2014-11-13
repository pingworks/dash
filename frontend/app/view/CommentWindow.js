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
Ext.define("Dash.view.CommentWindow", {
    extend: 'Ext.window.Window',
    alias: 'widget.commentwindow',
    requires: ['Ext.form.Panel','Ext.form.field.Text'],

    id: 'CommentWindow',
    title: 'Kommentar bearbeiten',
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
			fieldLabel: 'Kommentar'
		}],
        bbar: ['->', {
            xtype: 'button',
            id: 'Cancel',
            text: 'Abbrechen',
            handler: function(button, event){
                button.findParentByType('window').destroy();
            }
        }, {
            xtype: 'button',
            id: 'SaveComment',
            text: 'Speichern',
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
            window.setTitle(Ext.String.format("Kommentar für Bundle '{0}' bearbeiten", bundle.get('id')));
			var data = bundle.getData();
			window.down('form').getForm().setValues(data);
		}
	}
});
