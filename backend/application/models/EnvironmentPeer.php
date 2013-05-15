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

class Application_Model_EnvironmentPeer
{
	public static function generateFilenameForEnvId($string)
	{
		return Zend_Registry::get("datadir") . '/' . $string . '.json';
	}
	
	public static function getAllEnvironments()
	{
		$environmentIds = array();
		foreach (new DirectoryIterator( Zend_Registry::get("datadir") ) as $file)
		{
			if ( ! $file->isDot() && $file->isFile() && preg_match('/.json$/', $file->getFilename()) === 1)
			{
				$environmentIds[] = preg_replace('/.json$/', '', $file->getFilename());
			}
		}
		sort($environmentIds);
		$sortedEnvironments = array();
		foreach ($environmentIds as $id) 
		{
			$sortedEnvironments[] = self::getEnvironment($id);
		}
		return $sortedEnvironments;
	}
	
	public static function getEnvironment($id)
	{
		$environment = self::getEnvironmentFromJsonFile(self::generateFilenameForEnvId($id));
		return $environment;
	}
	
	public static function getEnvironmentFromJsonFile($filename)
	{
		$environment = self::getEnvironmentFromJsonString(file_get_contents($filename));
		return $environment;
	}
	
	public static function getEnvironmentFromJsonString($string)
	{
		$environment = new Application_Model_Environment();
		$environment->fromJson($string);
		$environment->clearExpiredLock();
		return $environment;
	}
	
}

