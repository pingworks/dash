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

class Application_Model_BundlePeer
{
	private static $stageNameMap = array( '1' => 'first', '2' => 'second', '3' => 'third'); 
	
	private static function getMetadata($branch, $id, $meta)
	{
		$filename = Zend_Registry::get("repodir") . '/' . $branch . '/' . $id . '/metadata/' . $meta;
		if ( ! file_exists( $filename))
		{
			return 'Unavailable';
		}
		return trim(file_get_contents($filename));
	}
	
	public static function getChanges($branch, $id)
	{
		return self::getMetadata($branch, $id, 'changes');
	}
	
	public static function getJobResults($branch, $id, $stage)
	{
		if (! array_key_exists($stage, self::$stageNameMap))
			throw new Exception('Ungueltiger Stage Key: ' . $stage);
		return self::getMetadata($branch, $id, self::$stageNameMap[$stage] . '_stage_results');
	}
	
	private static function getStageStatus($branch, $id, $stage)
	{
		$status = self::getMetadata($branch, $id, 'status');
		if (strstr($status, self::$stageNameMap[$stage] . '_stage_passed')) 
			return 3;
		if (strstr($status, self::$stageNameMap[$stage] . '_stage_failed'))
			return 2;
		if (strstr($status, self::$stageNameMap[$stage] . '_stage_in_progress'))
			return 1;
		return 0;
	}
	
	private static function getAllBundleIds($branch = 'trunk')
	{
		$data = array();
		foreach (new DirectoryIterator( Zend_Registry::get("repodir") . '/' . $branch) as $directory)
		{
			if ( ! $directory->isDot() && $directory->isDir())
				$data[] = $directory->getBasename();
		}
		return $data;
	}
	
	public static function getBundleForBranchAndId($branch = 'trunk', $id)
	{
		$bundleDir = Zend_Registry::get("repodir") . '/' . $branch . '/' . $id;
		if ( ! is_dir($bundleDir))
		{
			return null;
		}
		$bundle = new Application_Model_Bundle();
		$bundle->id = $id;
		$bundle->branch = self::getMetadata($branch, $id, 'branch');
		$bundle->revision = self::getMetadata($branch, $id, 'revision');
		$bundle->timestamp = self::getMetadata($branch, $id, 'timestamp');
		$bundle->committer = self::getMetadata($branch, $id, 'committer');
		$bundle->stage1 = self::getStageStatus($branch, $id, 1);
		$bundle->stage2 = self::getStageStatus($branch, $id, 2);
		$bundle->stage3 = self::getStageStatus($branch, $id, 3);
		$bundle->setChanges(self::getMetadata($branch, $id, 'changes'));
		return $bundle;
	}
	
	public static function getBundles($branch = 'trunk')
	{
		$bundles = array();
		foreach (self::getAllBundleIds($branch) as $id)
		{
			$bundles[] = self::getBundleForBranchAndId($branch, $id);
		}
		return $bundles;
	}
	
}

