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
