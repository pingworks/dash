<?php

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
		$this->assertType('array', $result->results);
		$this->assertEquals(2, count($result->results));
		$this->assertEquals($entry1, $result->results[0]);
		$this->assertEquals($entry2, $result->results[1]);
	}
}
