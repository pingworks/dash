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
class Application_Model_JobResultPeerTest extends PHPUnit_Framework_TestCase
{

    public function testGetJobResults()
    {
        $data = Application_Model_JobResultPeer::getJobResults('branchA', '88.941106ff.2', 2);
        $this->assertInternalType('array', $data);
        $this->assertEquals(2, count($data));

        $this->assertInstanceOf('Application_Model_JobResult', $data[0]);
        $this->assertAttributeEquals('foo', 'name', $data[0]);
        $this->assertAttributeEquals('bar', 'url', $data[0]);
        $this->assertAttributeEquals('SUCCESS', 'status', $data[0]);
        $this->assertAttributeEquals(1, 'total', $data[0]);
        $this->assertAttributeEquals(0, 'skipped', $data[0]);
        $this->assertAttributeEquals(0, 'failed', $data[0]);

        $this->assertInstanceOf('Application_Model_JobResult', $data[1]);
        $this->assertAttributeEquals('test', 'name', $data[1]);
        $this->assertAttributeEquals('url', 'url', $data[1]);
        $this->assertAttributeEquals('FAILURE', 'status', $data[1]);
        $this->assertAttributeEquals(2, 'total', $data[1]);
        $this->assertAttributeEquals(4, 'skipped', $data[1]);
        $this->assertAttributeEquals(2, 'failed', $data[1]);

    }

}
