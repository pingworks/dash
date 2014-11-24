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

class Application_Model_ContentPeer
{
    public static $latestVersion = null;

    public static function getAllContents()
    {
        $data = array();
        $entries = array();
        $keys = array();
        foreach (new DirectoryIterator(Zend_Registry::get("contentdir")) as $directory) {
            if (!$directory->isDot() && $directory->isDir() && !$directory->isLink()) {
                $entries[$directory->getBasename()] = self::getContentForVersion($directory->getBasename());
                $keys[] = $directory->getBasename();
            }
        }
        rsort($keys);
        foreach ($keys as $k) {
            $data[] = $entries[$k];
        }
        return $data;
    }

    public static function getContentForVersion($version)
    {
        $latestVersion = self::getLatestContentVersion();
        $version = ($version == 'latest') ? $latestVersion : $version;

        $cmsContentDir = Zend_Registry::get("contentdir") . '/' . $version;
        if (!is_dir($cmsContentDir)) {
            return null;
        }
        $cmsContent = new Application_Model_Content();
        $cmsContent->id = $version;
        $cmsContent->version = $version;
        $cmsContent->isLatest = ($latestVersion == $version) ? true : false;
        return $cmsContent;
    }

    private static function getLatestContentVersion()
    {
        if (is_null(self::$latestVersion)) {
            $filename = Zend_Registry::get("contentdir") . '/latest';
            if (!file_exists($filename) && !is_link($filename)) {
                self::$latestVersion = 'Unavailable';
            }
            self::$latestVersion = basename(readlink($filename));
        }
        return self::$latestVersion;
    }
}

