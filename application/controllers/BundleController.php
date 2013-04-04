<?php

class BundleController extends Zend_Rest_Controller
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
		$branch = (preg_match("/^[a-zA-Z0-9_-]+$/", $this->_getParam('branch')) === 0)
			? 'trunk'
			:  $this->_getParam('branch');
		
		$data = $this->getEmptyResult();
		$data['results'] = Application_Model_BundlePeer::getBundles($branch);
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