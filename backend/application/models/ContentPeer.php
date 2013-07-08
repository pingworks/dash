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

class Application_Model_ContentPeer
{
	public static $latestVersion = null;
	
	public static function getAllContents()
	{
		$data = array();
		$entries = array();
		$keys = array();
		foreach (new DirectoryIterator( Zend_Registry::get("contentdir")) as $directory)
		{
			if ( ! $directory->isDot() && $directory->isDir() && ! $directory->isLink())
			{
				$entries[$directory->getBasename()] = self::getContentForVersion($directory->getBasename());
				$keys[] = $directory->getBasename();
			}
		}
		rsort($keys);
		foreach ($keys as $k)
		{
			$data[] = $entries[$k];
		}
		return $data;
	}
	
	public static function getContentForVersion($version)
	{
		$latestVersion = self::getLatestContentVersion();
		$version = ($version == 'latest') ? $latestVersion : $version;
		
		$cmsContentDir = Zend_Registry::get("contentdir") . '/' . $version;
		if ( ! is_dir($cmsContentDir))
		{
			return null;
		}
		$cmsContent = new Application_Model_Content();
		$cmsContent->id = $version;
		$cmsContent->version = $version;
		$cmsContent->isLatest = ($latestVersion == $version) ? true : false;
		return $cmsContent;
	}
	
	private static function getLatestContentVersion()
	{
		if (is_null(self::$latestVersion))
		{ 
			$filename = Zend_Registry::get("contentdir") . '/latest';
			if ( ! file_exists($filename) && ! is_link($filename))
			{
				self::$latestVersion = 'Unavailable';
			}
			self::$latestVersion = basename(readlink($filename));
		}
		return self::$latestVersion;
	}
}

