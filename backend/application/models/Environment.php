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

class Application_Model_Environment
{
    public $id;
    public $name;
    public $domainname;
    public $deployable;
    public $locked;
    public $by;
    public $until;
    public $bundle;
    public $urls;
    public $content;

    public function getFilename()
    {
        if (!$this->id)
            throw new InvalidArgumentException('Can not generate filename without id property.');
        return Application_Model_EnvironmentPeer::generateFilenameForEnvId($this->id);
    }

    public function fromJson($json)
    {
        $environmentFromJson = json_decode($json);
        if (!$environmentFromJson instanceof stdClass)
            throw new InvalidArgumentException('Could not decode json string.');
        $this->id = $environmentFromJson->id;
        $this->name = $environmentFromJson->name;
        $this->domainname = $environmentFromJson->domainname;
        $this->deployable = (property_exists($environmentFromJson, 'deployable')) ? $environmentFromJson->deployable : '';
        $this->urls = (property_exists($environmentFromJson, 'urls')) ? $environmentFromJson->urls : '';
        $this->locked = (property_exists($environmentFromJson, 'locked')) ? $environmentFromJson->locked : 'false';
        $this->by = (property_exists($environmentFromJson, 'by')) ? $environmentFromJson->by : '';
        $this->until = (property_exists($environmentFromJson, 'until')) ? $environmentFromJson->until : '';
        $this->bundle = (property_exists($environmentFromJson, 'bundle')) ? $environmentFromJson->bundle : '';
        $this->content = (property_exists($environmentFromJson, 'content')) ? $environmentFromJson->content : '';
    }

    public function reload()
    {
        $filename = $this->getFilename();
        if (!file_exists($filename) || !is_readable($filename))
            throw new InvalidArgumentException('File does not exist or is not readable');
        $this->fromJson(file_get_contents($filename));
    }

    public function restoreImmutableProperties()
    {
        $clone = clone $this;
        $clone->reload();
        $this->id = $clone->id;
        $this->name = $clone->name;
        $this->domainname = $clone->domainname;
        $this->deployable = $clone->deployable;
        $this->urls = $clone->urls;
        # Do not overwrite content with empty value
        if ($this->content == '')
            $this->content = $clone->content;
    }

    public function save()
    {
        $this->restoreImmutableProperties();
        $jsonString = json_encode($this);
        $filename = $this->getFilename();
        if (!is_writable($filename))
            throw new Exception('File is not writeable: ' . $filename);
        file_put_contents($filename, $jsonString);
    }

    public function clearLock()
    {
        $this->locked = false;
        $this->by = '';
        $this->until = '';
    }

    public function hasExpiredLock()
    {
        if (!$this->locked)
            return false;
        $lockDate = new DateTime($this->until);
        $now = new DateTime();
        return ($lockDate < $now);
    }

    public function clearExpiredLock()
    {
        if ($this->hasExpiredLock())
            $this->clearLock();
    }
}
