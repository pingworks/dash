<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	public function run()
	{
		Zend_Registry::set("repodir", $this->getOption('repodir'));
		parent::run();
	}
}
