<?php
class Application_Model_ChangePeerTest extends PHPUnit_Framework_TestCase
{

	public function setUp()
	{
		$this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
		Zend_Registry::set("repodir", $this->bootstrap->getOption('repodir'));
		parent::setUp();
	}

	public function testGetChanges()
	{
		$data = Application_Model_ChangePeer::getChanges('branchA', '88.ab99a3b7.5');
		$this->assertType('array', $data);
		$this->assertEquals(1, count($data));
		$this->assertType('Application_Model_Change', $data[0]);
		$this->assertAttributeEquals('88.ab99a3b7.5', 'id', $data[0]);
		$this->assertAttributeEquals("This, of course, is not the real copy for this advertisement. The real words will be written once...\nThis, of course, is not the real copy for this advertisement. The real words will be written once...", 'msg', $data[0]);
	}

}
