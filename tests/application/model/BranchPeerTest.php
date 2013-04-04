<?php
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
		$this->assertTrue(array_search('trunk', $data) !== false);
		$this->assertTrue(array_search('branchA', $data) !== false);
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
