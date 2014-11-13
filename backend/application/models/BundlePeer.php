<?php
/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
 * Copyright 2014 //SEIBERT/MEDIA - Lars-Erik Kimmel
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

class Application_Model_BundlePeer
{
	private static $stageNameMap = array( '1' => 'first', '2' => 'second', '3' => 'third');

	private static function getAllMetaKeys($branch, $id)
	{
		$metaKeys = array();
		foreach (new DirectoryIterator( Zend_Registry::get("repodir") . '/' . $branch . '/' . $id . '/metadata/' ) as $keyFile)
		{
			if ( ! $keyFile->isDot() && $keyFile->isFile())
			{
				$basename = $keyFile->getBasename();
				if (! in_array($basename, array(
						'branch', 
						'revision', 
						'repository', 
						'timestamp', 
						'committer', 
						'comment',
						'changes', 
						'status',
						'buildnr',
						'bundle', 
						'first_stage_results', 
						'second_stage_results', 
						'third_stage_results')))
				{
					$metaKeys[] = $basename;
				}
			}
		}
		return $metaKeys;
	}
	
	private static function getMetadata($branch, $id, $meta, $default = false)
	{
		$filename = Zend_Registry::get("repodir") . '/' . $branch . '/' . $id . '/metadata/' . $meta;
		if ( ! file_exists( $filename))
		{
			if (false === $default)
			{
			return 'Unavailable';
			} else
			{
				return $default;
		}
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
			if ( ! $directory->isDot() && $directory->isDir() && ! $directory->isLink())
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
		$bundle->repository = self::getMetadata($branch, $id, 'repository');
		$bundle->timestamp = self::getMetadata($branch, $id, 'timestamp');
		$bundle->committer = self::getMetadata($branch, $id, 'committer');
		$bundle->comment = self::getMetadata($branch, $id, 'comment', '');
		$bundle->stage1 = self::getStageStatus($branch, $id, 1);
		$bundle->stage2 = self::getStageStatus($branch, $id, 2);
		$bundle->stage3 = self::getStageStatus($branch, $id, 3);
		$bundle->setChanges(self::getMetadata($branch, $id, 'changes'));
		$bundle->payload = array();
		foreach(self::getAllMetaKeys($branch, $id) as $key)
		{
			$bundle->payload[$key] = self::getMetadata($branch, $id, $key);
		}
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

