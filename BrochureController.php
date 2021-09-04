<?php

class BrochureController extends Zend_Controller_Action {

	public $Car;

	public function init() {
		Zend_Layout::getMvcInstance() -> setLayout('tools');		
	}

	public function indexAction() {}
	
	public function carAction() {
		$req1 = $this -> _request -> getParam('car');
		if (null == $req1) {
			throw new Zend_Controller_Action_Exception(null, 404);
		} else {
			$car = new Application_Model_Fleet_Car();
			$select = $car -> select() -> where('route = ?', $req1) -> where('status = ?', 'Published');
			$row = $car -> fetchRow($select);
			if ($row !== null) {
				$this -> Car = $row;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		}
		$this -> view -> car = $this -> Car;
	}
}