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

