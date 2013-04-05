<?php
class Application_Model_BundlePeerTest extends PHPUnit_Framework_TestCase
{

	public function setUp()
	{
		$this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
		Zend_Registry::set("repodir", $this->bootstrap->getOption('repodir'));
		parent::setUp();
	}

	public function testGetBundleForBranchAndId()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.ab99a3b7.5');
		
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals('branchA', 'branch', $data);
		$this->assertAttributeEquals('ab99a3b7', 'revision', $data);
		$this->assertAttributeEquals('88.ab99a3b7.5', 'id', $data);
		$this->assertAttributeEquals("This, of course, is not the real copy for this advertisement. The real words will be written once...\nThis, of course, is not the real copy for this advertisement. The real words will be written once...", 'changes', $data);
		$this->assertAttributeEquals("Tim Tester", 'committer', $data);
		$this->assertAttributeEquals("2013-04-04_15:15:15", 'timestamp', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus5()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.ab99a3b7.5');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(1, 'stage1', $data);
		$this->assertAttributeEquals(0, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus6()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.62035ef5.6');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(2, 'stage1', $data);
		$this->assertAttributeEquals(0, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus7()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.9067858f.7');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(1, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus8()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.1aea659e.8');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(2, 'stage2', $data);
		$this->assertAttributeEquals(0, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus9()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.47694b9c.9');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(3, 'stage2', $data);
		$this->assertAttributeEquals(1, 'stage3', $data);
	}
	
	public function testGetBundleForBranchAndIdStageStatus10()
	{
		$data = Application_Model_BundlePeer::getBundleForBranchAndId('branchA', '88.faaeeb60.10');
		$this->assertType('Application_Model_Bundle', $data);
		$this->assertAttributeEquals(3, 'stage1', $data);
		$this->assertAttributeEquals(3, 'stage2', $data);
		$this->assertAttributeEquals(3, 'stage3', $data);
	}
	
	public function testGetBundles()
	{
		$data = Application_Model_BundlePeer::getBundles('branchA');
		
		$this->assertType('array', $data);
		$this->assertEquals(10, count($data));
		for ($i=0; $i<=9; $i++)
		{
			$this->assertType('Application_Model_Bundle', $data[$i]);
		}
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
