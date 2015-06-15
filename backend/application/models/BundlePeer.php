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
    private static $stageNameMap = array(
        '1' => 'first',
        '2' => 'second',
        '3' => 'third',
        '4' => 'fourth',
        '5' => 'fifth',
        '6' => 'sixth',
        '7' => 'seventh',
        '8' => 'eighth',
        '9' => 'ninth',
        '10' => 'tenth'
    );

    private static $baseMetaKeys = array(
        'branch',
        'branch_name',
        'pname',
        'revision',
        'repository',
        'timestamp',
        'committer',
        'comment',
        'changes',
        'status',
        'buildnr',
        'bundle',
    );

    private static $ignoreMetaKeys = array(
      'first_stage_results',
      'second_stage_results',
      'third_stage_results',
      'fourth_stage_results',
      'fifth_stage_results',
      'sixth_stage_results',
      'seventh_stage_results',
      'eighth_stage_results',
      'ninth_stage_results',
      'tenth_stage_results'
    );

    private static function getDynamicMetaKeys()
    {
        $keys = array();
        $maxStages = Zend_Registry::get("pipelinestages");
        for($i=1; $i<=$maxStages; $i++) {
            array_push($keys, self::$stageNameMap[$i]);
        }
        return $keys;
    }

    private static function getAllMetaKeys($branch, $id)
    {
        $metaKeys = array();
        foreach (new DirectoryIterator(Zend_Registry::get("repodir") . '/' . $branch . '/' . $id . '/metadata/') as $keyFile) {
            if (!$keyFile->isDot() && $keyFile->isFile()) {
                $basename = $keyFile->getBasename();
                if (!in_array($basename, array_merge(self::$baseMetaKeys, self::getDynamicMetaKeys(), self::$ignoreMetaKeys)))
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
        if (!file_exists($filename)) {
            if (false === $default) {
                return 'Unavailable';
            } else {
                return $default;
            }
        }
        return trim(file_get_contents($filename));
    }

    private static function setMetadata($branch, $id, $meta, $value)
    {
        $metadataDir = Zend_Registry::get("repodir") . '/' . $branch . '/' . $id . '/metadata';
        $metadataFilename = $metadataDir . '/' . $meta;
        if (!is_writable($metadataDir)) {
            throw new Exception("Cannot write to metadata dir: '$metadataDir'");
        }
        if (file_exists($metadataFilename) && !is_writable($metadataFilename)) {
            throw new Exception("Cannot write to metadata file: '$metadataFilename'");
        }

        return file_put_contents($metadataFilename, $value);
    }

    public static function getComment($branch, $id)
    {
        return self::getMetadata($branch, $id, 'comment');
    }

    public static function setComment($branch, $id, $comment)
    {
        return self::setMetadata($branch, $id, 'comment', $comment);
    }

    public static function getChanges($branch, $id)
    {
        return self::getMetadata($branch, $id, 'changes');
    }

    public static function getJobResults($branch, $id, $stage)
    {
        if (!array_key_exists($stage, self::$stageNameMap))
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
        foreach (new DirectoryIterator(Zend_Registry::get("repodir") . '/' . $branch) as $directory) {
            if (!$directory->isDot() && $directory->isDir() && !$directory->isLink())
                $data[] = $directory->getBasename();
        }
        return $data;
    }

    public static function getBundleForBranchAndId($branch = 'trunk', $id)
    {
        $bundleDir = Zend_Registry::get("repodir") . '/' . $branch . '/' . $id;
        if (!is_dir($bundleDir)) {
            return null;
        }
        $bundle = new Application_Model_Bundle();
        $bundle->id = $id;
        $bundle->branch = self::getMetadata($branch, $id, 'branch');
        $bundle->branch_name = self::getMetadata($branch, $id, 'branch_name');
        $bundle->pname = self::getMetadata($branch, $id, 'pname');
        $bundle->revision = self::getMetadata($branch, $id, 'revision');
        $bundle->repository = self::getMetadata($branch, $id, 'repository');
        $bundle->timestamp = self::getMetadata($branch, $id, 'timestamp');
        $bundle->committer = self::getMetadata($branch, $id, 'committer');
        $bundle->comment = self::getMetadata($branch, $id, 'comment', '');
        $maxStages = Zend_Registry::get("pipelinestages");
        for($i=1; $i<=$maxStages; $i++) {
            $sname = 'stage' . $i;
            $svalue = self::getStageStatus($branch, $id, $i);
            if ($svalue != null)
            {
                $bundle->$sname = $svalue;
            }
        }
        $bundle->setChanges(self::getMetadata($branch, $id, 'changes'));
        $buildUrls = self::getMetadata($branch, $id, 'buildurl', '');
        $bundle->buildUrls = ($buildUrls) ? explode("\n", $buildUrls) : array();
        $bundle->payload = array();
        foreach (self::getAllMetaKeys($branch, $id) as $key) {
            $bundle->payload[$key] = self::getMetadata($branch, $id, $key);
        }
        return $bundle;
    }

    public static function getBundlesForBranch($branch = 'trunk')
    {
        $bundles = array();
        foreach (self::getAllBundleIds($branch) as $id) {
            $bundles[] = self::getBundleForBranchAndId($branch, $id);
        }
        return $bundles;
    }

    public static function getBundles($branch = 'trunk')
    {
      $bundles = array();
      if ( $branch == 'ALL' ) {
        $branches = Application_Model_BranchPeer::getAllBranchIds();
        foreach ($branches as $singleBranch) {
          $bundles = array_merge($bundles, self::getBundlesForBranch($singleBranch));
        }
      }
      else {
        $bundles = self::getBundlesForBranch($branch);
      }
      return $bundles;
    }

  }
