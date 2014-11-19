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
Ext.define('Dash.model.Environment', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'domainname', type: 'string' },
        { name: 'deployable', type: 'boolean' },
        { name: 'locked', type: 'boolean' },
        { name: 'by', type: 'string' },
        { 
            name: 'until', 
            type: 'date', 
            convert: function(value, record) { 
                return Ext.Date.parse(value, Dash.config.environment.dateformat)
            }
        },
        { 
            name: 'label', 
            type: 'string', 
            convert: function(value, record) {
                var until = record.get('until');
                var dateFormat = Dash.config.environment.dateformat; 
                var label =(record.get('locked')) 
                    ? ' genutzt von ' + record.get('by') + ' bis ' 
                        + Ext.util.Format.date(until, dateFormat)
                    : ''; 
                return record.get('name') + label;
            }
        },
        { name: 'bundle', type: 'string' },
        { name: 'urls', type: 'auto' },
        { name: 'content', type: 'string'},
        { name: 'dbreset', type: 'boolean'}
    ],
    proxy: {
        type: 'rest',
        url: Dash.config.environment.endpoint,
        reader: {
            type: 'json',
            root: 'results'
        },
        writer: {
            type: 'json',
            dateFormat: Dash.config.environment.dateformat
        }
    }
});

