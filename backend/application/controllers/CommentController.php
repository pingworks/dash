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