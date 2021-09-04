<?php

class NewsletterController extends Zend_Controller_Action {

	protected $_form;
	protected $_redirector = null;

	public function init() {
		$this -> _redirector = $this -> _helper -> getHelper('Redirector');
		$this -> _form = new Application_Form_Newsletter();
	}

	public function indexAction() {
		$this -> view -> form = $this -> _form;
	}

	public function processAction() {
		$this->_helper->viewRenderer->setNoRender();
		if (!$this -> _request -> isPost()) {
			$this -> _redirector -> gotoUrl('/');
		}
		if ($this -> _request -> isPost()) {
			$datas = $this -> _request -> getPost();
			if ($this->_form -> isValid($datas)) {
				$data['email'] = $datas['kit_email'];				
				$file = fopen(DATA_PATH.'/newsletter/'.time().'_keep-in-touch.csv', 'w');
				if ($file) {
					fputcsv($file, $data);
					fclose($file);
					$this -> _redirector -> gotoUrl('/tools/newsletter/complete.html');
				}				
			} else {
				$this -> _redirector -> gotoUrl('/');
			}
		}
	}
	
	public function completeAction() {
		Zend_Layout::getMvcInstance() -> setLayout('tools');
	}
	

}