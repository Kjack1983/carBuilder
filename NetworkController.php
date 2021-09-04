<?php

class NetworkController extends Zend_Controller_Action {
	
	public function viewAction() {
		Zend_Layout::getMvcInstance() -> setLayout('tools');
		$mode = $this -> _request -> getParam('mode');
		
		if (null !== $mode) {
			if ($mode == 'map' || $mode == 'list') {
				$this->view->mode = $mode;				
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);				
			}			
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}		
	}

}
