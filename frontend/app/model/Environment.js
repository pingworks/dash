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

