<?php
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

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    public function run()
    {
        Zend_Registry::set("contentdir", $this->getOption('contentdir'));
        Zend_Registry::set("repodir", $this->getOption('repodir'));
        Zend_Registry::set("datadir", $this->getOption('datadir'));
        Zend_Registry::set("defaultbranch", $this->getOption('defaultbranch'));
        parent::run();
    }
}
