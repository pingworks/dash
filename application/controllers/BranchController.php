<?php

class BranchController extends Zend_Rest_Controller
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
		$data = $this->getEmptyResult();
		$data['results'] = Application_Model_BranchPeer::getAllBranchs();
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