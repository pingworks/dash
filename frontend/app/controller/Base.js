/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
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
        var data;
        if (response.responseText != ''){
            data = Ext.JSON.decode(response.responseText);
        }
        if (data && data.exception){
            msg += '<br /><br />Message: ' + data.exception;
        }
        if (data && data.trace){
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