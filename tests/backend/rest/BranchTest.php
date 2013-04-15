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
		
		$idx1 = array_search($entry1, $result->results);
		$idx2 = array_search($entry2, $result->results);
		$this->assertNotEquals(false, $idx1);
		$this->assertNotEquals(false, $idx2);
		
		$this->assertEquals($entry1, $result->results[$idx1]);
		$this->assertEquals($entry2, $result->results[$idx2]);
	}
}
