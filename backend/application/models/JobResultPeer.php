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

class Application_Model_JobResultPeer
{
	private static function getJobResultFromString($string)
	{
		$jobResult = new Application_Model_JobResult();
		$fields = explode(';', $string);
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
		$jobResultStrings = explode("\n", $jobResultFileContent);
		$jobResults = array();
		foreach ($jobResultStrings as $string) {
			$jobResult = self::getJobResultFromString($string);
			$jobResult->id = $bundleId;
			$jobResults[] = $jobResult;
		}

		return $jobResults;
	}
}

