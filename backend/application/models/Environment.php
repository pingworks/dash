<?php
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

class Application_Model_Environment
{
	public $id;
	public $name;
	public $domainname;
	public $locked;
	public $by;
	public $until;
	public $bundle;
	public $urls;
	public $content;
	
	public function getFilename()
	{
		if (! $this->id)
			throw new Exception('Can not generate filename without id property.');
		return Application_Model_EnvironmentPeer::generateFilenameForEnvId($this->id);
	}
	
	public function fromJson($json)
	{
		$environmentFromJson = json_decode($json);
		if (! $environmentFromJson instanceof stdClass)
			throw new Exception('Could not decode json string.');
		$this->id = $environmentFromJson->id;
		$this->name = $environmentFromJson->name;
		$this->domainname = $environmentFromJson->domainname;
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
		if (! file_exists($filename) || ! is_readable($filename))
			throw new Exception('File does not exist or is not readable');
		$this->fromJson(file_get_contents($filename));
	}
	
	public function restoreImmutableProperties()
	{
		$clone = clone $this;
		$clone->reload();
		$this->id = $clone->id;
		$this->name = $clone->name;
		$this->domainname = $clone->domainname;
		$this->urls = $clone->urls;
	}
	
	public function save()
	{
		$this->restoreImmutableProperties();
		$jsonString = json_encode($this);
		$filename = $this->getFilename();
		if(! is_writable($filename))
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
