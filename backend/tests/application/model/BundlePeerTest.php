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
class Application_Model_BundlePeerTest extends PHPUnit_Framework_TestCase
{

	public function testGetBundleForBranchAndId()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.ab99a3b7.5');
		
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals('branchA', 'branch', $data);
		$this->assertAttributeEquals('ab99a3b7', 'revision', $data);
		$this->assertAttributeEquals('88.ab99a3b7.5', 'id', $data);
		$this->assertAttributeEquals("This, of course, is not the real copy for this advertisement. The real words will be written once...\nThis, of course, is not the real copy for this advertisement. The real words will be written once...", 'changes', $data);
		$this->assertAttributeEquals("Tim Tester", 'committer', $data);
		$this->assertAttributeEquals("2013-04-04_15:15:15", 'timestamp', $data);
	}
	
	public function testGetBundleForBranchAndIdIgnoreFile()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('trunk', 'testfile');
		
		$this->assertNull($data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus5()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.ab99a3b7.5');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(1, 'stage1', $data);
		$this->assertAttributeEquals(0, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus6()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.62035ef5.6');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(2, 'stage1', $data);
		$this->assertAttributeEquals(0, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus7()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.9067858f.7');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(1, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus8()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.1aea659e.8');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(2, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus9()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.47694b9c.9');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(3, 'stage2', $data);
		$this->assertAttributeEquals(1, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus10()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.faaeeb60.10');
		$this->assertInstanceOf('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(3, 'stage2', $data);
		$this->assertAttributeEquals(3, 'stage3', $data);
	}
	
	public function testGetBundles()
	{
		$data = Application_Model_BundlePeer::getBundles('branchA');
		
		$this->assertInternalType('array', $data);
		$this->assertEquals(10, count($data));
		for ($i=0; $i<=9; $i++)
		{
			$this->assertInstanceOf('Application_Model_Bundle', $data[$i]);
		}
	}
	
	public function testGetBundlesIgnoreFiles()
	{
		$data = Application_Model_BundlePeer::getBundles('trunk');
		
		$this->assertInternalType('array', $data);
		$this->assertEquals(0, count($data));
	}
	
	public function testGetChanges()
	{
		$data = Application_Model_BundlePeer::getChanges('branchA', '88.faaeeb60.10');
		
		$this->assertEquals("Mit Blindheit per Definition geschlagen, dennoch nicht unsichtbar, präsentiere ich mich als unbeachtetes und ungeliebtes Stiefkind zeitgenössischer Literatur.\nMit Blindheit per Definition geschlagen, dennoch nicht unsichtbar, präsentiere ich mich als unbeachtetes und ungeliebtes Stiefkind zeitgenössischer Literatur.", $data);
	}
	
	public function testGetJobResults()
	{
		$data = Application_Model_BundlePeer::getJobResults('branchA', '88.941106ff.2', 2);
		
		$this->assertEquals("foo;bar;SUCCESS;1;0;0\ntest;url;FAILURE;2;4;2", $data);
	}

}
