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

class BranchTest extends RestTest
{
	public function testBranchGet()
	{
		$data = $this->getRequest($this->bootstrap->getOption('url') . '/branch/');
		
		$result = json_decode($data);
		
		$entry1 = new stdClass();
		$entry1->id = $entry1->name = $entry1->url = 'trunk';
		$entry2 = new stdClass();
		$entry2->id = $entry2->name = 'branchA';
		$entry2->url = 'branches/branchA';
		
		$this->assertTrue($result->success);
		$this->assertInternalType('array', $result->results);
		$this->assertEquals(2, count($result->results));
		
		$idx1 = array_search($entry1, $result->results);
		$idx2 = array_search($entry2, $result->results);
		$this->assertNotSame(false, $idx1);
		$this->assertNotSame(false, $idx2);
		
		$this->assertEquals($entry1, $result->results[$idx1]);
		$this->assertEquals($entry2, $result->results[$idx2]);
	}
}
