<?php

class Application_Model_BundlePeer
{
	private static $stageNameMap = array( '1' => 'first', '2' => 'second', '3' => 'third'); 
	
	private static $repoDir = '/opt/bundlerepo/';

	private static function getMetadata($branch, $id, $meta)
	{
		$filename = self::$repoDir . $branch . '/' . $id . '/metadata/' . $meta;
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
		foreach (new DirectoryIterator( self::$repoDir . $branch) as $directory)
		{
			if ( ! $directory->isDot())
				$data[] = $directory->getBasename();
		}
		return $data;
	}
	
	public static function getBundleForBranchAndId($branch = 'trunk', $id)
	{
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

