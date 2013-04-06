<?php
require_once('PHPUnit/Extensions/SeleniumTestCase.php');

class BundleGridTest extends PHPUnit_Extensions_SeleniumTestCase
{
	public static $seleneseDirectory = 'selenium/BundleGrid';
	
	public static $browsers = array(
			array(
					'name' => 'Firefox Linux',
					'browser' => '*firefox'
			)
	);
	
 	public function __construct($name = NULL, array $data = array(), $dataName = '', array $browser = array())
 	{
 		$this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');

 		$seleniumConfig = $this->bootstrap->getOption('selenium');
 		$browser['host'] = $seleniumConfig['host'];
 		$browser['port'] = (int) $seleniumConfig['port'];
 		$browser['timeout'] = (int) $seleniumConfig['timeout'];
 		return parent::__construct($name, $data, $dataName, $browser);
 	}
	
	public function setUp()
	{
		$this->setBrowserUrl($this->bootstrap->getOption('url'));
		parent::setUp();
	}
}