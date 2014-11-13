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

class Application_Model_Bundle
{
	public $id;
	public $branch;
	public $revision;
	public $repository;
	public $stage1;
	public $stage2;
	public $stage3;
	public $timestamp;
	public $committer;
	public $buildUrls;
	private $changes;
	public $payload;

	public function getChanges()
	{
		return $this->changes;
	}

	public function setChanges($changes)
	{
		$this->changes = $changes;
	}

}

