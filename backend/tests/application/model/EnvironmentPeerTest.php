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
class Application_Model_EnvironmentPeerTest extends PHPUnit_Framework_TestCase
{
	private $expected01;
	
	private $expected02;
	
	private $expected03;
	
	private $expected04;
	
	public function setUp()
	{
		parent::setUp();
		$this->expected01 = new Application_Model_Environment();
		$this->expected01->id = 'testenv01';
		$this->expected01->name = 'Test Env 01';
		$this->expected01->domainname = 'testenv01.pingworks.net';
		$this->expected01->deployable = true;
		$this->expected01->locked = true;
		$this->expected01->by = 'cluk';
		$this->expected01->until = '2020-05-24 12:12:12';
		$this->expected01->bundle = '1.a914d764.62'; 
		$url1 = new stdClass();
		$url1->name = "Env 01 - App1";
		$url1->url = "http://dash01.pingworks.net/app1";
		$url2 = new stdClass();
		$url2->name = "Env 01 - App2";
		$url2->url = "http://dash01.pingworks.net/app2";
		$this->expected01->urls = array($url1, $url2);
		
		$this->expected02 = new Application_Model_Environment();
		$this->expected02->id = 'testenv02';
		$this->expected02->name = 'Test Env 02';
		$this->expected02->domainname = 'testenv02.pingworks.net';
		$this->expected02->deployable = true;
		$this->expected02->locked = false;
		$this->expected02->by = '';
		$this->expected02->until = '';
		$this->expected02->bundle = ''; 
		
		$this->expected03 = new Application_Model_Environment();
		$this->expected03->id = 'testenv03';
		$this->expected03->name = 'Test Env 03';
		$this->expected03->domainname = 'testenv03.pingworks.net';
		$this->expected03->deployable = true;
		$this->expected03->locked = false;
		$this->expected03->by = '';
		$this->expected03->until = '';
		$this->expected03->bundle = ''; 
		
		$this->expected04 = new Application_Model_Environment();
		$this->expected04->id = 'testenv04';
		$this->expected04->name = 'Test Env 04';
		$this->expected04->domainname = 'testenv04.pingworks.net';
		$this->expected04->deployable = false;
		$this->expected04->locked = false;
		$this->expected04->by = '';
		$this->expected04->until = '';
		$this->expected04->bundle = '1.a914d764.62'; 
		$url1 = new stdClass();
		$url1->name = "Env 04 - App1";
		$url1->url = "http://dash04.pingworks.net/app1"; 
		$url2 = new stdClass();
		$url2->name = "Env 04 - App2";
		$url2->url = "http://dash04.pingworks.net/app2"; 
		$this->expected04->urls = array($url1, $url2);
	}

	public function testGetEnvironmentFromJsonFile()
	{
		$env = Application_Model_EnvironmentPeer::getEnvironmentFromJsonFile(Zend_Registry::get("datadir") . '/testenv01.json');
		$this->assertEquals($this->expected01, $env);
	}

	public function testGetEnvironmentFromJsonFile_ExpiredLock()
	{
		$env = Application_Model_EnvironmentPeer::getEnvironmentFromJsonFile(Zend_Registry::get("datadir") . '/testenv04.json');
		$this->assertEquals($this->expected04, $env);
	}
	
	public function testGetAllEnvironments()
	{
		$envs = Application_Model_EnvironmentPeer::getAllEnvironments();
		$this->assertEquals(
				array(
						$this->expected01,
						$this->expected02,
						$this->expected03,
						$this->expected04), $envs);
	}

}
