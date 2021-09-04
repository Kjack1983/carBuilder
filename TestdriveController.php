<?php

class TestdriveController extends Zend_Controller_Action {

	public $Car;

	public function init() {
		Zend_Layout::getMvcInstance() -> setLayout('tools');
	}
	
	public function indexAction() {}
	
	public function carAction() {
		$req = $this -> _request -> getParam('car');
		if (null == $req) {
			throw new Zend_Controller_Action_Exception(null, 404);
		} elseif ('complete-testdrive' == $req) {
			$this -> proccessData($this -> _request -> getParams());
		} else {
			$oCar = new Application_Model_Fleet_Car();
			$select = $oCar -> select() -> where('route = ?', $req)
			-> where('testdrive = ?', 'Yes')
			-> where('status = ?', 'Published');
			$car = $oCar -> fetchRow($select);
			if ($car !== null) {
				$this -> Car = $car;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		}
		$this -> view -> car = $this -> Car;		
	}
	
	public function thanksAction() {}

	private function proccessData($datas) {
		$data;
		
		if ($this -> _request -> isPost()) {
			$data['car'] = htmlentities($datas['model']);
			$data['title'] = htmlentities($datas['title']);
			$data['forename'] = htmlentities($datas['forename']);
			$data['surname'] = htmlentities($datas['surname']);
			$data['email'] = htmlentities($datas['email']);
			$data['comments'] = htmlentities($datas['comments']);
			$data['confirmphone'] = htmlentities($datas['confirm-phone']);
			$data['mobilephone'] = htmlentities($datas['mobilephone']);
			$data['confirm-marketing-email-sms'] = htmlentities($datas['confirm-marketing-email-sms']);
			$data['confirm-marketing-phonecall'] = htmlentities($datas['confirm-marketing-phonecall']);
			
			$file = fopen(DATA_PATH.'/testdrive/'.time().'_'.$data['car'].'.csv', 'w');
			if ($file) {
				fputcsv($file, $data);
				fclose($file);
				$this->_forward('thanks');				
			}						
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
	}
}
