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
class Application_Model_ChangePeerTest extends PHPUnit_Framework_TestCase
{

	public function testGetChanges()
	{
		$data = Application_Model_ChangePeer::getChanges('branchA', '88.ab99a3b7.5');
		$this->assertInternalType('array', $data);
		$this->assertEquals(1, count($data));
		$this->assertInstanceOf('Application_Model_Change', $data[0]);
		$this->assertAttributeEquals('88.ab99a3b7.5', 'id', $data[0]);
		$this->assertAttributeEquals("This, of course, is not the real copy for this advertisement. The real words will be written once...\nThis, of course, is not the real copy for this advertisement. The real words will be written once...", 'msg', $data[0]);
	}

}
