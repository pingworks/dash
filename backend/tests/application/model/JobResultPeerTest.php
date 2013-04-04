<?php
class Application_Model_JobResultPeerTest extends PHPUnit_Framework_TestCase
{

	public function setUp()
	{
		$this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
		Zend_Registry::set("repodir", $this->bootstrap->getOption('repodir'));
		parent::setUp();
	}

	public function testGetJobResults()
	{
		$data = Application_Model_JobResultPeer::getJobResults('branchA', '88.941106ff.2', 2);
		$this->assertType('array', $data);
		$this->assertEquals(2, count($data));

		$this->assertType('Application_Model_JobResult', $data[0]);
		$this->assertAttributeEquals('foo', 'name', $data[0]);
		$this->assertAttributeEquals('bar', 'url', $data[0]);
		$this->assertAttributeEquals('SUCCESS', 'status', $data[0]);
		$this->assertAttributeEquals(1, 'total', $data[0]);
		$this->assertAttributeEquals(0, 'skipped', $data[0]);
		$this->assertAttributeEquals(0, 'failed', $data[0]);
		
		$this->assertType('Application_Model_JobResult', $data[1]);
		$this->assertAttributeEquals('test', 'name', $data[1]);
		$this->assertAttributeEquals('url', 'url', $data[1]);
		$this->assertAttributeEquals('FAILURE', 'status', $data[1]);
		$this->assertAttributeEquals(2, 'total', $data[1]);
		$this->assertAttributeEquals(4, 'skipped', $data[1]);
		$this->assertAttributeEquals(2, 'failed', $data[1]);
		
	}

}
