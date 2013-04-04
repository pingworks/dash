<?php

class Application_Model_Bundle
{
	public $id;
	public $branch;
	public $revision;
	public $stage1;
	public $stage2;
	public $stage3;
	public $timestamp;
	public $committer;
	private $changes;
	
	public function getChanges()
	{
		return $this->changes;
	}
	
	public function setChanges($changes)
	{
		$this->changes = $changes;
	}

}

