<?php
/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
 		parent::__construct($name, $data, $dataName);
 		$this->setupSpecificBrowser($browser);
 		return $this;
 	}
	
	public function setUp()
	{
		foreach (new DirectoryIterator( Zend_Registry::get("datadir").'/backup' ) as $file)
		{
			if ( ! $file->isDot() && $file->isFile() && preg_match('/.json$/', $file->getFilename()) === 1)
			{
				copy($file->getPathname(), Zend_Registry::get("datadir") . '/' . $file->getFilename());
							try
				{
					chmod(Zend_Registry::get("datadir") . '/' . $file->getFilename(), '0438');
				} catch (Exception $e) {
				}
			}
		}
		
		$this->setBrowserUrl($this->bootstrap->getOption('url'));
		parent::setUp();
	}
}