<?php

class Application_Model_JobResultPeer
{
	private static function getJobResultFromString($string)
	{
		$jobResult = new Application_Model_JobResult();
		$fields = split(';', $string);
		$jobResult->name = (array_key_exists(0, $fields)) ? $fields[0] : 'Unavailable';
		$jobResult->url = (array_key_exists(1, $fields)) ? $fields[1] : '';
		$jobResult->status = (array_key_exists(2, $fields)) ? $fields[2] : 'Unavailable';
		$jobResult->total = (array_key_exists(3, $fields)) ? $fields[3] : '-';
		$jobResult->skipped = (array_key_exists(4, $fields)) ? $fields[4] : '-';
		$jobResult->failed = (array_key_exists(5, $fields)) ? $fields[5] : '-';
		return $jobResult;
	}

	public static function getJobResults($branch, $bundleId, $stage)
	{
		$jobResultFileContent = Application_Model_BundlePeer::getJobResults($branch, $bundleId, $stage);
		$jobResultStrings = split("\n", $jobResultFileContent);
		$jobResults = array();
		foreach ($jobResultStrings as $string) {
			$jobResult = self::getJobResultFromString($string);
			$jobResult->id = $bundleId;
			$jobResults[] = $jobResult;
		}
		
		return $jobResults;
	}
}

