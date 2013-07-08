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

require_once('RestTest.php');

class EnvironemtTest extends RestTest
{
	private $expected01;
	
	private $expected02;
	
	private $expected03;
	
	private $expected04;
	
	public function setUp()
	{
		parent::setUp();
		foreach (new DirectoryIterator( Zend_Registry::get("datadir").'/backup' ) as $file)
		{
			if ( ! $file->isDot() && $file->isFile() && preg_match('/.json$/', $file->getFilename()) === 1)
			{
				copy($file->getPathname(), Zend_Registry::get("datadir") . '/' . $file->getFilename());
				chmod(Zend_Registry::get("datadir") . '/' . $file->getFilename(), '0438');
			}
		}
		
		$this->expected01 = new stdClass();
		$this->expected01->id = 'testenv01';
		$this->expected01->name = 'Test Env 01';
		$this->expected01->domainname = 'testenv01.pingworks.net';
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
		$this->expected01->content = '';
		
		$this->expected02 = new stdClass();
		$this->expected02->id = 'testenv02';
		$this->expected02->name = 'Test Env 02';
		$this->expected02->domainname = 'testenv02.pingworks.net';
		$this->expected02->locked = false;
		$this->expected02->by = '';
		$this->expected02->until = '';
		$this->expected02->bundle = '';
		$this->expected02->urls = ''; 
		$this->expected02->content = '';
		
		$this->expected03 = new stdClass();
		$this->expected03->id = 'testenv03';
		$this->expected03->name = 'Test Env 03';
		$this->expected03->domainname = 'testenv03.pingworks.net';
		$this->expected03->locked = false;
		$this->expected03->by = '';
		$this->expected03->until = '';
		$this->expected03->bundle = ''; 
		$this->expected03->urls = '';
		$this->expected03->content = '';
		
		$this->expected04 = new stdClass();
		$this->expected04->id = 'testenv04';
		$this->expected04->name = 'Test Env 04';
		$this->expected04->domainname = 'testenv04.pingworks.net';
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
		$this->expected04->content = '';
	}
	
	public function testEnvironmentIndex()
	{
		$response = $this->getRequest($this->bootstrap->getOption('url') . '/environment/');
		
		$result = json_decode($response);
		
		$this->assertTrue($result->success);
		$this->assertType('array', $result->results);
		$this->assertEquals(4, count($result->results));
		
		$this->assertEquals(array(
				$this->expected01,
				$this->expected02,
				$this->expected03,
				$this->expected04), $result->results);
	}

	public function testEnvironmentGet()
	{
		$response = $this->getRequest($this->bootstrap->getOption('url') . '/environment/testenv01');
		
		$result = json_decode($response);
		
		$this->assertTrue($result->success);
		$this->assertType('stdClass', $result->results);
		
		$this->assertEquals($this->expected01, $result->results);
	}

	public function testEnvironmentGet_ExpiredLock()
	{
		$response = $this->getRequest($this->bootstrap->getOption('url') . '/environment/testenv04');
		
		$result = json_decode($response);
		
		$this->assertTrue($result->success);
		$this->assertType('stdClass', $result->results);
		
		$this->assertEquals($this->expected04, $result->results);
	}

	public function testEnvironmentPut()
	{
		$url = $this->bootstrap->getOption('url') . '/environment/testenv02';
		$data = clone $this->expected02;
		$data->locked = true;
		$data->by = 'user';
		$data->until = '2020-12-12 12:12:12';
		
		$response = $this->putRequest($url, json_encode($data));
		$result = json_decode($response);
		
		$this->assertTrue($result->success);
		$this->assertType('stdClass', $result->results);
		$this->assertEquals($data, $result->results);
		
		$response = $this->getRequest($this->bootstrap->getOption('url') . '/environment/testenv02');
		$result = json_decode($response);
		
		$this->assertTrue($result->success);
		$this->assertType('stdClass', $result->results);
		$this->assertEquals($data, $result->results);
		
	}
}
