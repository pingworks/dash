<?php
/*
 * Copyright 2013 pingworks - Alexander Birk und Christoph Lukas
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

class EnvironmentController extends Zend_Rest_Controller
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
        $data['results'] = Application_Model_EnvironmentPeer::getAllEnvironments();
        $this->getResponse()->setBody(json_encode($data));
        $this->getResponse()->setHttpResponseCode(200);
    }

    public function getAction()
    {
        $regex = $this->getInvokeArg('bootstrap')->getOption('paramregex');
        if (preg_match($regex['envid'], $this->_getParam('id')) === 0)
            throw new Exception('Illegal Environment Id.');
        $id = $this->_getParam('id');

        $data = $this->getEmptyResult();
        $data['results'] = Application_Model_EnvironmentPeer::getEnvironment($id);
        $this->getResponse()->setBody(json_encode($data));
        $this->getResponse()->setHttpResponseCode(200);
    }

    public function headAction()
    {
    }

    public function postAction()
    {
    }

    public function putAction()
    {
        $regex = $this->getInvokeArg('bootstrap')->getOption('paramregex');
        if (preg_match($regex['envid'], $this->_getParam('id')) === 0)
            throw new Exception('Illegal Environment Id.');
        $id = $this->_getParam('id');

        $environment = Application_Model_EnvironmentPeer::getEnvironmentFromJsonFile('php://input');
        $content = $environment->content;
        $envConfig = $this->getInvokeArg('bootstrap')->getOption('environment');
        if (is_array($envConfig) && array_key_exists('addUsernameFromEnv', $envConfig)) {
            if ($envConfig['addUsernameFromEnv'] != '' && getenv($envConfig['addUsernameFromEnv']) != '') {
                if ($environment->by != getenv($envConfig['addUsernameFromEnv'])) {
                    $environment->by .= ' (' . getenv($envConfig['addUsernameFromEnv']) . ')';
                }
            }
        }
        $environment->save();

        $data = $this->getEmptyResult();
        $environment = Application_Model_EnvironmentPeer::getEnvironment($id);
        $environment->content = $content;
        $data['results'] = $environment;
        $this->getResponse()->setBody(json_encode($data));
        $this->getResponse()->setHttpResponseCode(200);
    }

    public function deleteAction()
    {
    }
}