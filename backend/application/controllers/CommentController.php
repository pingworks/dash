<?php
/*
 * Copyright 2014 //SEIBERT/MEDIA - Lars-Erik Kimmel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class CommentController extends Zend_Rest_Controller
{
	public function init()
	{
		$this->_helper->viewRenderer->setNoRender(true);
	}

	public function indexAction()
	{
	}

	public function getAction()
	{
	}

	public function headAction()
	{
	}

	public function postAction()
	{
		$branch = $this->_getParam('branch');
		$bundle = $this->_getParam('bundle');
		$comment = $this->_getParam('comment');

		$regex = $this->getInvokeArg('bootstrap')->getOption('paramregex');
		if (preg_match($regex['branch'], $branch) === 0)
		{
			throw new Exception("No valid branch for editing comment specified: '$branch'");
		}
		if (empty($bundle))
		{
			throw new Exception("No bundle for editing comment specified");
		}
		$branchDir = Zend_Registry::get("repodir") . '/' . $branch;
		if (!is_dir($branchDir))
		{
			throw new Exception("The branch '$branch' does not exist");
		}
		$bundleDir = $branchDir . '/' . $bundle;
		if (!is_dir($bundleDir))
		{
			throw new Exception("The bundle '$bundle' does not exist");
		}
		$commentFilename = $bundleDir . '/metadata/comment';
		if (!is_writable($commentFilename))
		{
			throw new Exception("Cannot write comment file: '$commentFilename'");
		}

		file_put_contents($commentFilename, $comment);
		$this->getResponse()->setBody(json_encode(array('success' => true)));
		$this->getResponse()->setHttpResponseCode(200);
	}

	public function putAction()
	{
	}

	public function deleteAction()
	{
	}
}