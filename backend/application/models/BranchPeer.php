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

class Application_Model_BranchPeer
{
	public static function getAllBranchIds()
	{
		$data = array();
		$default = '';
		foreach (new DirectoryIterator( Zend_Registry::get("repodir") ) as $directory)
		{
			if ( ! $directory->isDot() && $directory->isDir())
			{
				$basename = $directory->getBasename();
				/* Skip ALL folder, for internal use only */
				if ($basename == "ALL") {
					continue;
				}
		 		if ($basename === Zend_Registry::get("defaultbranch"))
		 		{
		 			$default = $basename;
		 		} else {
					$data[] = $basename;
		 		}
			}
		}
		asort($data);
		if ($default != '')
			array_unshift($data, $default);
		return $data;
	}
	
	/* FIXME: add support for branch specific metadata */
	private static function findBranchNameInBundleMetadata($branchDir, $fallbackName)
	{
		foreach (new DirectoryIterator($branchDir) as $directory)
		{
		    if (! $directory->isDot() && $directory->isDir())
		    {
				$filename = $directory->getPathname() ."/metadata/branch_name";
				if (file_exists($filename))
				{
					return trim(file_get_contents($filename));
				}
			}
		}
		return $fallbackName;
	}
	
	public static function getAllBranchs()
	{
		$branches = array();
		foreach (self::getAllBranchIds() as $id)
		{
			$branch = new Application_Model_Branch();
			$branch->id = $id;
			$branch->name = self::findBranchNameInBundleMetadata(Zend_Registry::get("repodir") .'/'. $id, $id);
			$branch->url = ($id == 'trunk') ? $id : 'branches/' . $id;
			$branches[] = $branch;
		}
		return $branches;
	}
	
}

