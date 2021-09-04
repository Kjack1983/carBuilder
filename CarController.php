<?php

class CarController extends Zend_Controller_Action {

	public $Category;
	public $Car;

	public function init() {
		Zend_Layout::getMvcInstance() -> setLayout('car-default');
		$req1 = $this -> _request -> getParam('category');
		$req2 = $this -> _request -> getParam('car');
		if (null == $req1) {
			throw new Zend_Controller_Action_Exception(null, 404);
		} else {
			$oCategory = new Application_Model_Fleet_Car_Category();
			$select = $oCategory -> select() -> where('route = ?', $req1) -> where('status = ?', 'Published');
			$category = $oCategory -> fetchRow($select);
			if ($category !== null) {
				$this -> Category = $category;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		}
		if (null == $req2) {
			throw new Zend_Controller_Action_Exception(null, 404);
		} else {
			$oCar = new Application_Model_Fleet_Car();
			$select = $oCar -> select() -> where('route = ?', $req2) -> where('status = ?', 'Published');
			$car = $oCar -> fetchRow($select);
			if ($car !== null) {
				$this -> Car = $car;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		}
		$this -> view -> category = $this -> Category;
		$this -> view -> car = $this -> Car;
	}

	public function homeAction() {
		$oImage = new Application_Model_Fleet_Car_Image();
		$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', 'home') -> where('is_default = ?', 'Yes') -> where('status = ?', 'Published');
		$image = $oImage -> fetchRow($select);
		if ($image !== null) {
			$this -> view -> cover = $image -> full;
		} else {
			$this -> view -> cover = null;
		}
		$oContent = new Application_Model_Fleet_Car_Content();
		$select = $oContent -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', 'home') -> where('status = ?', 'Published');
		$content = $oContent -> fetchRow($select);
		if ($content !== null) {
			$this -> view -> page_content = $content -> content;
		} else {
			$this -> view -> page_content = null;
		}
	}

	public function featuresAction() {
		Zend_Layout::getMvcInstance() -> setLayout('car-features');
		if ($this -> Car -> features == 'No') {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
	}

	public function discoverAction() {
		$req = $this -> _request -> getParam('feature');
		if (null !== $req) {
			if ($req == 'exterior' || $req == 'interior') {
				$oImage = new Application_Model_Fleet_Car_Image();
				$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', $req) -> where('is_default = ?', 'Yes') -> where('status = ?', 'Published');
				$image = $oImage -> fetchRow($select);
				if ($image !== null) {
					$this -> view -> image_title = $image -> full;
				} else {
					$this -> view -> image_title = null;
				}
				$select -> reset();
				$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('type = ?', ucfirst($req)) -> where('gallery = ?', 'Yes') -> where('is_default = ?', 'No') -> where('status = ?', 'Published');
				$select -> order('sort ASC');
				$set = $oImage -> fetchAll($select);
				if (!empty($set)) {
					$this -> view -> image_set = $set;
				} else {
					$this -> view -> image_set = null;
				}
				$this -> view -> section = $req;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}

	}
	
	
	public function equipmentAction() {
		$req = $this -> _request -> getParam('page');
		if (null !== $req) {
			if ($req == 'prices' || $req == 'accessories') {
				$oImage = new Application_Model_Fleet_Car_Image();
				$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', 'Exterior') -> where('is_default = ?', 'Yes') -> where('status = ?', 'Published');
				$image = $oImage -> fetchRow($select);
				if ($image !== null) {
					$this -> view -> image_title = $image -> full;
				} else {
					$this -> view -> image_title = null;
				}
				if ($req == 'prices') {
					$select -> reset();
					$oGrade = new Application_Model_Fleet_Car_Grade();
					$select = $oGrade -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Published');
					$select -> order('sort ASC');
					$grades = $oGrade -> fetchAll($select);
					if (!empty($grades)) {
						$select -> reset();
						$oVehicle = new Application_Model_Fleet_Car_Vehicle();
						$oEngine = new Application_Model_Fleet_Car_Engine();
						foreach ($grades as $grade) {
							$select = $oVehicle -> select() -> where('car_id = ?', $this -> Car -> id) -> where('grade_id = ?', $grade -> id) -> where('status = ?', 'Published');
							$select -> order('sort ASC');
							$vehicles = $oVehicle -> fetchAll($select);
							if (!empty($vehicles)) {
								$Vehicles = array();
								foreach ($vehicles as $vehicle) {
									$select = $oEngine -> select() -> where('vehicle_id = ?', $vehicle -> id);
									$engine = $oEngine -> fetchRow($select);
									if (null !== $engine) {
										$Engine = array('cc' => $engine -> cubic_capacity, 'fuel' => $engine -> fuel_type, 'trans' => $engine -> transmission);
									} else {
										$Engine = null;
									}
									$Vehicles[$vehicle -> id] = array('ident' => $vehicle -> identification, 'name' => $vehicle -> name, 'price' => $vehicle -> price, 'body' => $vehicle -> body_type, 'seats' => $vehicle -> seat_no, 'engine' => $Engine, 'available' => $vehicle -> availability);
								}
							}
							$Set[$grade -> id] = array('name' => $grade -> name, 'description' => $grade -> description_full, 'vehicles' => $Vehicles, );
						}
						$this -> view -> grade_set = $Set;
					} else {
						throw new Zend_Controller_Action_Exception(null, 404);
					}
				}
				if ($req == 'accessories') {
					$select -> reset();
					$oAccessories = new Application_Model_Fleet_Car_Accessory();
					$select = $oAccessories -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Yes');
					$accessories = $oAccessories -> fetchAll($select);
					if (!empty($accessories)) {
						$this -> view -> accessories_set = $accessories;
					} else {
						$this -> view -> accessories_set = null;
					}
				}
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
		$this -> view -> page = $req;
	}

	public function galleryAction() {
		$req = $this -> _request -> getParam('gallery');
		if (null !== $req) {
			if ($req == 'photos' || $req == 'videos') {
				$oImage = new Application_Model_Fleet_Car_Image();
				$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', 'photo') -> where('is_default = ?', 'Yes') -> where('status = ?', 'Published');
				$image = $oImage -> fetchRow($select);
				if ($image !== null) {
					$this -> view -> image_title = $image -> full;
				} else {
					$this -> view -> image_title = null;
				}
				if ($req == 'photos') {
					$select -> reset();
					$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', rtrim($req, 's')) -> where('type = ?', 'Exterior') -> where('gallery = ?', 'Yes') -> where('is_default = ?', 'No') -> where('status = ?', 'Published');
					$select -> order('sort ASC');
					$extSet = $oImage -> fetchAll($select);
					if (!empty($extSet)) {
						$this -> view -> image_extset = $extSet;
					} else {
						$this -> view -> image_extset = null;
					}
					$select -> reset();
					$select = $oImage -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', rtrim($req, 's')) -> where('type = ?', 'Interior') -> where('gallery = ?', 'Yes') -> where('is_default = ?', 'No') -> where('status = ?', 'Published');
					$select -> order('sort ASC');
					$intSet = $oImage -> fetchAll($select);
					if (!empty($intSet)) {
						$this -> view -> image_intset = $intSet;
					} else {
						$this -> view -> image_intset = null;
					}
				} elseif ($req == 'videos') {
					$select -> reset();
					$oVideo = new Application_Model_Fleet_Car_Video();
					$select = $oVideo -> select() -> where('car_id = ?', $this -> Car -> id) -> where('page = ?', rtrim($req, 's')) -> where('gallery = ?', 'Yes') -> where('status = ?', 'Published');
					$select -> order('sort ASC');
					$vidSet = $oVideo -> fetchAll($select);
					if (!empty($vidSet)) {
						$this -> view -> video_set = $vidSet;
					} else {
						$this -> view -> video_set = null;
					}
				}
				$this -> view -> gallery = $req;
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}

	}

	public function specificationAction() {
		$req = $this -> _request -> getParam('ident');
		if (null !== $req) {
			$oVehicle = new Application_Model_Fleet_Car_Vehicle();
			$select = $oVehicle -> select() -> where('car_id = ?', $this -> Car -> id) -> where('identification = ?', $req) -> where('status = ?', 'Published');
			$vehicle = $oVehicle -> fetchRow($select);
			if ($vehicle !== null) {
				$this -> view -> vehicle = $vehicle;
				$oVRiggings = new Application_Model_Fleet_Car_Rigging();
				$select -> reset();
				$select = $oVRiggings -> select() -> where('vehicle_id = ?', $vehicle -> id) -> where('status = ?', 'Yes');
				$vehicleRiggings = $oVRiggings -> fetchAll($select);
				if (!empty($vehicleRiggings)) {
					$riggingSet;
					foreach ($vehicleRiggings as $vr) {
						$oRigging = new Application_Model_Fleet_Rigging();
						$oRCategory = new Application_Model_Fleet_Rigging_Category();
						$select -> reset();
						$select = $oRigging -> select() -> where('id = ?', $vr -> rigging_id) -> where('status = ?', 'Yes');
						$rigging = $oRigging -> fetchRow($select);
						if ($rigging !== null) {
							$select -> reset();
							$select = $oRCategory -> select() -> where('id = ?', $rigging -> category_id) -> where('status = ?', 'Yes');
							$rigCategory = $oRCategory -> fetchRow($select);
							if ($rigCategory !== null) {
								$riggingSet[$rigCategory -> name][] = array('name' => $rigging -> name, 'type' => $vr -> type, 'price' => $vr -> price);
							}
						}
					}
					$this -> view -> vehicle_riggings = $riggingSet;
				} else {
					$this -> view -> vehicle_riggings = null;
				}
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
			$oColor = new Application_Model_Fleet_Car_Color();
			$select -> reset();
			$select = $oColor -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Yes');
			$colors = $oColor -> fetchAll($select);
			if (!empty($colors)) {
				$this -> view -> colors = $colors;
			} else {
				$this -> view -> colors = null;
			}

		} else {
			throw new Zend_Controller_Action_Exception(null, 404);
		}
	}

}
