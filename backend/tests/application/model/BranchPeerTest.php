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
class Application_Model_BranchPeerTest extends PHPUnit_Framework_TestCase
{

	public function testGetAllBranchIds()
	{
		$data = Application_Model_BranchPeer::getAllBranchIds();
		$this->assertInternalType('array', $data);
		$this->assertEquals(2, count($data));
		$this->assertContains('trunk', $data);
		$this->assertContains('branchA', $data);
		$this->assertNotContains('testfile', $data);
	}

	public function testGetAllBranchs()
	{
		$data = Application_Model_BranchPeer::getAllBranchs();
		$this->assertInternalType('array', $data);
		$this->assertEquals(2, count($data));
		for ($i=0; $i<=1; $i++)
		{
			$this->assertInstanceOf('Application_Model_branch', $data[$i]);
			$this->assertEquals($data[$i]->id, $data[$i]->name);
		}
	}
	
}
