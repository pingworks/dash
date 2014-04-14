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
				$filename = $directory->getFilename() ."/metadata/branch_name";
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

