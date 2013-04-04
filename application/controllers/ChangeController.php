<?php

class ChangeController extends Zend_Rest_Controller
{
	public function init()
	{
		$this->_helper->viewRenderer->setNoRender(true);
	}
	
	private function getEmptyResult()
	{
		return array(
				'success' => true,
				'results' => array()
		);
	}
	
	public function indexAction() 
	{
		if (preg_match("/^[0-9]+\.[0-9]+\.[0-9]+$/", $this->_getParam('bundle')) === 0)
		{
			throw new Exception('Ungueltige Bundle Id');
		}
		$bundleId = $this->_getParam('bundle');
		
		if (preg_match("/^[0-9a-zA-Z-_]+$/", $this->_getParam('branch')) === 0)
		{
			throw new Exception('Ungueltiger Branch');
		}
		$branch = $this->_getParam('branch');
		
		$data = $this->getEmptyResult();
		$data['results'] = Application_Model_ChangePeer::getChanges($branch, $bundleId);
		$this->getResponse()->setBody(json_encode($data));
		$this->getResponse()->setHttpResponseCode(200);
	}

	public function getAction() 
	{}

	public function headAction() 
	{}

	public function postAction() 
	{}

	public function putAction() 
	{}

	public function deleteAction() 
	{}
}