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
Ext.define('Dash.store.Bundles', {
    extend: 'Ext.data.Store',
    requires: 'Dash.model.Bundle',
    model: 'Dash.model.Bundle',
    sorters: [
        {
            property: Dash.config.bundlegrid.sort.field,
            direction: Dash.config.bundlegrid.sort.dir
        }
    ]
});