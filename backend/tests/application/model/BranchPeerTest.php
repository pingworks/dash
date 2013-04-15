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
class Application_Model_BranchPeerTest extends PHPUnit_Framework_TestCase
{

	public function setUp()
	{
		$this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
		Zend_Registry::set("repodir", $this->bootstrap->getOption('repodir'));
		parent::setUp();
	}

	public function testGetAllBranchIds()
	{
		$data = Application_Model_BranchPeer::getAllBranchIds();
		$this->assertType('array', $data);
		$this->assertEquals(2, count($data));
		$this->assertContains('trunk', $data);
		$this->assertContains('branchA', $data);
		$this->assertNotContains('testfile', $data);
	}

	public function testGetAllBranchs()
	{
		$data = Application_Model_BranchPeer::getAllBranchs();
		$this->assertType('array', $data);
		$this->assertEquals(2, count($data));
		for ($i=0; $i<=1; $i++)
		{
			$this->assertType('Application_Model_branch', $data[$i]);
			$this->assertEquals($data[$i]->id, $data[$i]->name);
		}
	}
	
}
