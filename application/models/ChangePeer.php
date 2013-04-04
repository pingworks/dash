<?php

class Application_Model_ChangePeer
{
	private static $scriptsDir = '/opt/deploy/';

	public static function getChanges($branch, $bundleId)
	{
		$changes = Application_Model_BundlePeer::getChanges($branch, $bundleId);
		$change = new Application_Model_Change();
		$change->id = $bundleId;
		$change->msg = $changes; 
		return array($change);
	}
}

