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