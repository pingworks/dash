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
Ext.define('Dash.controller.Base', {
    extend: 'Ext.app.Controller',
    init: function(){
        Ext.each(this.stores, function(storeName){
            this.getStore(storeName).getProxy().on({
	            'exception': {
	                fn: this.onAjaxError,
	                scope: this
	            }
	        });
        }, this);
    },
    onError: function(response, options) {
        var msg = 'Der Request zum Server ist fehlgeschlagen. <br />HTTP Status: ' + response.status;
        var data = Ext.JSON.decode(response.responseText);
        if (data.exception){
            msg += '<br /><br />Message: ' + data.exception;
        }
        if (data.trace){
            msg += '<br /><br />Trace:'
            Ext.each(data.trace, function(call){
                msg += '<br />' + call.file + ':' + call.line;
            }, this);
        }
        Ext.Msg.alert('Fehler', msg);
    },
    onAjaxError: function(dummy, response, operation, eOpts){
        this.onError(response);
    }
});