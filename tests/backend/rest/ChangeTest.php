<?php

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
		$this->assertType('array', $result->results);
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
		$this->assertType('array', $result->results);
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
		$this->assertType('array', $result->results);
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
