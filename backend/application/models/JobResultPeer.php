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

