<?php

class Application_Model_BranchPeer
{
	public static function getAllBranchIds()
	{
		$data = array();
		foreach (new DirectoryIterator( Zend_Registry::get("repodir") ) as $directory)
		{
			if ( ! $directory->isDot())
				$data[] = $directory->getBasename();
		}
		return $data;
	}
	
	public static function getAllBranchs()
	{
		$branches = array();
		foreach (self::getAllBranchIds() as $id)
		{
			$branch = new Application_Model_Branch();
			$branch->id = $id;
			$branch->name = $id;
			$branch->url = ($id == 'trunk') ? $id : 'branches/' . $id;
			$branches[] = $branch;
		}
		return $branches;
	}
	
}

