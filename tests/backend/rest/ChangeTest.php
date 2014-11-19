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

require_once('RestTest.php');

class ChangeTest extends RestTest
{
	public function testChangeGetSuccess()
	{
		$params = array(
				'branch' => 'branchA',
				'bundle' => '88.ab99a3b7.5'
		);
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/change/', $params);
		
		$result = json_decode($data);
		
		$entry1 = new stdClass();
		$entry1->id = '88.ab99a3b7.5';
		$entry1->msg = "This, of course, is not the real copy for this advertisement. The real words will be written once...\nThis, of course, is not the real copy for this advertisement. The real words will be written once...";
		$entry1->ctime = '';
		
		$this->assertTrue($result->success);
		$this->assertInternalType('array', $result->results);
		$this->assertEquals(1, count($result->results));
		$this->assertEquals($entry1, $result->results[0]);
	}

	public function testChangeGetFailureWrongId()
	{
		$params = array(
				'branch' => 'branchA',
				'bundle' => '88.ab99a3b7.33'
		);
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/change/', $params);
		
		$result = json_decode($data);
		
		$entry1 = new stdClass();
		$entry1->id = '88.ab99a3b7.33';
		$entry1->msg = "Unavailable";
		$entry1->ctime = '';
		
		$this->assertTrue($result->success);
		$this->assertInternalType('array', $result->results);
		$this->assertEquals(1, count($result->results));
		$this->assertEquals($entry1, $result->results[0]);
	}

	public function testChangeGetFailureWrongBranch()
	{
		$params = array(
				'branch' => 'brancha',
				'bundle' => '88.ab99a3b7.33'
		);
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/change/', $params);
		
		$result = json_decode($data);
		
		$entry1 = new stdClass();
		$entry1->id = '88.ab99a3b7.33';
		$entry1->msg = "Unavailable";
		$entry1->ctime = '';
		
		$this->assertTrue($result->success);
		$this->assertInternalType('array', $result->results);
		$this->assertEquals(1, count($result->results));
		$this->assertEquals($entry1, $result->results[0]);
	}

	public function testChangeGetFailureIllegalBranch()
	{
		$params = array(
				'branch' => 'branc/&$/&%$ha',
				'bundle' => '88.ab99a3b7.33'
		);
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/change/', $params);
		
		$result = json_decode($data);
		
		$this->assertNull($result);
	}

	public function testChangeGetFailureIllegalBundle()
	{
		$params = array(
				'branch' => 'branc/&$/&%$ha',
				'bundle' => '88.ab99aÖÄÜ3b7.33'
		);
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/change/', $params);
		
		$result = json_decode($data);
		
		$this->assertNull($result);
	}
}
