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
class Application_Model_EnvironmentTest extends PHPUnit_Framework_TestCase
{

	public function testHasExpiredLock_LockedAndNotExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = true;
		$until = new DateTime();
		date_add($until, DateInterval::createFromDateString("1 hour"));
		$env->until = $until->format("Y-m-d H:i:s");
		$this->assertFalse($env->hasExpiredLock());
	}

	public function testHasExpiredLock_LockedAndExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = true;
		$until = new DateTime();
		date_sub($until, DateInterval::createFromDateString("5 second"));
		$env->until = $until->format("Y-m-d H:i:s");
		$this->assertTrue($env->hasExpiredLock());
	}

	public function testHasExpiredLock_NotLockedAndNotExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = false;
		$until = new DateTime();
		date_add($until, DateInterval::createFromDateString("1 hour"));
		$env->until = $until->format("Y-m-d H:i:s");
		$this->assertFalse($env->hasExpiredLock());
	}

	public function testHasExpiredLock_NotLockedAndExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = false;
		$until = new DateTime();
		date_sub($until, DateInterval::createFromDateString("5 second"));
		$env->until = $until->format("Y-m-d H:i:s");
		$this->assertFalse($env->hasExpiredLock());
	}
	
	public function testClearLock()
	{
		$env = new Application_Model_Environment();
		$env->id = 'id';
		$env->name = 'name';
		$env->domainname = 'domainname';
		$env->bundle = '12.123123123.12';
		
		$expectedEnv = clone $env;
		$env->locked = true;
		$env->by = 'by';
		$env->until = '2011-12-12 04:04:04';
		$env->clearLock();
		
		$this->assertEquals($expectedEnv, $env);
		
	}

	public function testClearExpiredLock_LockedAndNotExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = true;
		$until = new DateTime();
		date_add($until, DateInterval::createFromDateString("1 hour"));
		$env->until = $until->format("Y-m-d H:i:s");
		$env->by = 'by';
		
		$env->clearExpiredLock();
		$this->assertTrue($env->locked);
		$this->assertEquals($until->format("Y-m-d H:i:s"), $env->until);
		$this->assertEquals('by', $env->by);
	}

	public function testClearExpiredLock_LockedAndExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = true;
		$until = new DateTime();
		date_sub($until, DateInterval::createFromDateString("5 second"));
		$env->until = $until->format("Y-m-d H:i:s");
		$env->by = 'by';
		
		$env->clearExpiredLock();
		$this->assertFalse($env->locked);
		$this->assertEquals('', $env->until);
		$this->assertEquals('', $env->by);
	}

	public function testClearExpiredLock_NotLockedAndNotExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = false;
		$until = new DateTime();
		date_add($until, DateInterval::createFromDateString("1 hour"));
		$env->until = $until->format("Y-m-d H:i:s");
		$env->by = 'by';

		$env->clearExpiredLock();
		$this->assertFalse($env->locked);
		$this->assertEquals($until->format("Y-m-d H:i:s"), $env->until);
		$this->assertEquals('by', $env->by);
	}

	public function testClearExpiredLock_NotLockedAndExpired()
	{
		$env = new Application_Model_Environment();
		$env->locked = false;
		$until = new DateTime();
		date_sub($until, DateInterval::createFromDateString("5 second"));
		$env->until = $until->format("Y-m-d H:i:s");
		$env->by = 'by';

		$env->clearExpiredLock();
		$this->assertFalse($env->locked);
		$this->assertEquals($until->format("Y-m-d H:i:s"), $env->until);
		$this->assertEquals('by', $env->by);
	}
	
	public function testFromJson()
	{
		$env = new Application_Model_Environment();
		$env->fromJson('{ "id": "id", "name":"name", "domainname":"f.q.d.n" }');
		
		$this->assertEquals('id', $env->id);
		$this->assertEquals('name', $env->name);
		$this->assertEquals('f.q.d.n', $env->domainname);
	}
	
	public function testFromJson_IgnoreInvalidProperty()
	{
		$env = new Application_Model_Environment();
		$env->fromJson('{ "id": "id", "foo": "bar", "name":"name", "domainname":"f.q.d.n" }');
		
		$this->assertEquals('id', $env->id);
		$this->assertObjectNotHasAttribute('foo', $env);
	}
	
	public function testFromJson_InvalidJson()
	{
		$env = new Application_Model_Environment();
		$this->setExpectedException('InvalidArgumentException');
		$env->fromJson('{ "id": "id", "name":"name", "domainname":"f.q.d.n" ');
	}
	
	public function testReload()
	{
		$env = new Application_Model_Environment();
		$env->id = 'testenv01';
		
		$env->reload();
		$this->assertEquals('testenv01', $env->id);
		$this->assertEquals('Test Env 01', $env->name);
		$this->assertEquals('testenv01.pingworks.net', $env->domainname);
		$this->assertEquals(true, $env->locked);
		$this->assertEquals('cluk', $env->by);
		$this->assertEquals('2020-05-24 12:12:12', $env->until);
		$this->assertEquals('1.a914d764.62', $env->bundle);
	}
	
	public function testReload_NonExistentEnv()
	{
		$env = new Application_Model_Environment();
		$env->id = 'testenv18';
		
		$this->setExpectedException('InvalidArgumentException');
		$env->reload();
	}
	
	public function testRestoreImmutableProperties()
	{
		$env = new Application_Model_Environment();
		$env->id = 'testenv01';
		
		$env->reload();
		$env->name = 'foobar';
		$env->domainname = 'test.ping.pong';
		$env->locked = false;
		$env->by = '';
		
		$env->restoreImmutableProperties();
		$this->assertEquals('testenv01', $env->id);
		$this->assertEquals('Test Env 01', $env->name);
		$this->assertEquals('testenv01.pingworks.net', $env->domainname);
		$this->assertEquals(false, $env->locked);
		$this->assertEquals('', $env->by);
		$this->assertEquals('2020-05-24 12:12:12', $env->until);
		$this->assertEquals('1.a914d764.62', $env->bundle);
	}
	
}
