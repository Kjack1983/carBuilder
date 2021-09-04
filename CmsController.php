<?php

class CmsController extends Zend_Controller_Action {

	public function viewAction() {
		$url = $this -> _request -> getParam('url');
		if ($url == 'lcvs') {
			$this -> view -> url = 'lcvs';
		} elseif (null !== $url && $url !== 'lcvs') {
			$Page = new Application_Model_Cms_Content();
			$row = null;
			$select = $Page -> select();
			$select -> where('route = ?', $url);
			$select -> where('status = ?', 'Published');
			$row = $Page -> fetchRow($select);
			if ($row !== null) {
				$this -> view -> page = $row;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
		if ($url == 'black-edition') {
			$this -> view -> url = 'black-edition';
		} elseif (null !== $url && $url !== 'black-edition') {
			$Page = new Application_Model_Cms_Content();
			$row = null;
			$select = $Page -> select();
			$select -> where('route = ?', $url);
			$select -> where('status = ?', 'Published');
			$row = $Page -> fetchRow($select);
			if ($row !== null) {
				$this -> view -> page = $row;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
	}

}
