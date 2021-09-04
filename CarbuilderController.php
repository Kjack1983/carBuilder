<?php

class CarbuilderController extends Zend_Controller_Action {

	public $Category;
	public $Car;

	protected $GradeSet;

	protected $VehicleSet;

	protected $ColorSet;

	protected $TrimSet;

	protected $RiggingSet;

	protected $AccessorySet;

	public function init() {
		Zend_Layout::getMvcInstance() -> setLayout('carbuilder');
		$contextSwitch = $this -> _helper -> getHelper('contextSwitch');
		$contextSwitch -> addActionContext('carconfigure', 'json') -> initContext();

		$req1 = $this -> _request -> getParam('car');
		if (null === $req1) {
			throw new Zend_Controller_Action_Exception(null, 404);
		} else {
			$oCar = new Application_Model_Fleet_Car();
			$select = $oCar -> select() -> where('route = ?', $req1) -> where('status = ?', 'Published');
			$car = $oCar -> fetchRow($select);
			if ($car !== null) {
				$this -> Car = $car;
				$oCategory = new Application_Model_Fleet_Car_Category();
				$select = $oCategory -> select() -> where('id = ?', $this -> Car -> category_id) -> where('status = ?', 'Published');
				$category = $oCategory -> fetchRow($select);
				if ($category !== null) {
					$this -> Category = $category;
				} else {
					throw new Zend_Controller_Action_Exception(null, 404);
				}
				//init Colors
				$oColor = new Application_Model_Fleet_Car_Color();
				$select = $oColor -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Yes');
				$colors = $oColor -> fetchAll($select);
				if (!empty($colors)) {
					foreach ($colors as $color) {
						$this -> ColorSet[$color -> id] = array('description' => trim($color -> description, " "), 'type' => $color -> type, 'price' => $color -> price, 'rgb' => '#' . $color -> code_rgb, 'image' => $this -> view -> baseUrl('media/' . $color -> image_full));
					}
				} else {
					$this -> ColorSet = null;
				}
				//init Accessories
				$oAccessory = new Application_Model_Fleet_Car_Accessory();
				$select = $oAccessory -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Yes');
				$accessories = $oAccessory -> fetchAll($select);
				if (!empty($accessories)) {
					foreach ($accessories as $accessory) {
						$this -> AccessorySet[0][$accessory -> id] = array('category' => $accessory -> description_short, 'sku' => $accessory -> sku, 'teaser' => trim($accessory -> description_short, " "), 'description' => $accessory -> description_full, 'price' => $accessory -> price, 'image_thumb' => $this -> view -> baseUrl('media/accessories/' . $accessory -> image_thumb), 'image_full' => $this -> view -> baseUrl('media/accessories/' . $accessory -> image_full));
					}
				} else {
					$this -> AccessorySet = null;
				}
				//init Vehicles
				$oGrade = new Application_Model_Fleet_Car_Grade();
				$select = $oGrade -> select() -> where('car_id = ?', $this -> Car -> id) -> where('status = ?', 'Published');
				$select -> order('sort ASC');
				$grades = $oGrade -> fetchAll($select);
				if (!empty($grades)) {
					foreach ($grades as $grade) {
						$oVehicle = new Application_Model_Fleet_Car_Vehicle();
						$select = $oVehicle -> select() -> where('car_id = ?', $this -> Car -> id) -> where('grade_id = ?', $grade -> id) -> where('status = ?', 'Published');
						$select -> order('sort ASC');
						$vehicles = $oVehicle -> fetchAll($select);
						if (!empty($vehicles)) {
							foreach ($vehicles as $vehicle) {
								//Engine
								$oEngine = new Application_Model_Fleet_Car_Engine();
								$select = $oEngine -> select() -> where('vehicle_id = ?', $vehicle -> id);
								$engine = $oEngine -> fetchRow($select);
								if (null === $engine) {
									$engine = new stdClass();
									$engine -> cubic_capacity = null;
									$engine -> fuel_type = null;
									$engine -> transmission = null;
								}
								//Riggings
								$oVRiggings = new Application_Model_Fleet_Car_Rigging();
								$select = $oVRiggings -> select() -> where('vehicle_id = ?', $vehicle -> id) -> where('status = ?', 'Yes');
								$vehicleRiggings = $oVRiggings -> fetchAll($select);
								if (!empty($vehicleRiggings)) {
									foreach ($vehicleRiggings as $vr) {
										$oRigging = new Application_Model_Fleet_Rigging();
										$oRCategory = new Application_Model_Fleet_Rigging_Category();
										$select -> reset();
										$select = $oRigging -> select() -> where('id = ?', $vr -> rigging_id) -> where('status = ?', 'Yes');
										$rigging = $oRigging -> fetchRow($select);
										if ($rigging !== null) {
											$select -> reset();
											$select = $oRCategory -> select() -> where('id = ?', $rigging -> category_id) -> where('status = ?', 'Yes');
											$category = $oRCategory -> fetchRow($select);
											if ($category !== null) {
												$this -> RiggingSet[$vehicle -> id][$category -> id][$rigging -> id] = array('category' => trim($category -> name, " "), 'name' => trim($rigging -> name, " "), 'type' => $vr -> type, 'price' => $vr -> price);
											} else {
												$this -> RiggingSet[$vehicle -> id] = null;
											}
										}
									}
								} else {
									$this -> RiggingSet[$vehicle -> id] = null;
								}
								$this -> VehicleSet[$grade -> id][$vehicle -> id] = array('name' => $vehicle -> name, 'price' => $vehicle -> price, 'fuel' => $engine -> fuel_type, 'engine' => (round(((int)$engine -> cubic_capacity) / (1000), 1)), 'transmission' => $engine -> transmission, 'body' => $vehicle -> body_type, 'doors' => $vehicle -> door_no . '-θυρο');
							}
						} else {
							$this -> VehicleSet = null;
						}
						$this -> GradeSet[$grade -> id] = array(
						 'name' => $grade -> name,
						 'image' => $this->view->baseUrl('media/'.$grade->image_thumb)
						);
					}
				} else {
					$this -> GradeSet[0] = null;
				}
			} else {
				throw new Zend_Controller_Action_Exception(null, 404);
			}
		}

		$this -> view -> category = $this -> Category -> route;
		$this -> view -> car = $this -> Car -> route;
	}
	
	public function arrayUnique($array, $preserveKeys = false)
	{
	    // Unique Array for return
	    $arrayRewrite = array();
	    // Array with the md5 hashes
	    $arrayHashes = array();
	    foreach($array as $key => $item) {
	        // Serialize the current element and create a md5 hash
	        $hash = md5(serialize($item));
	        // If the md5 didn't come up yet, add the element to
	        // to arrayRewrite, otherwise drop it
	        if (!isset($arrayHashes[$hash])) {
	            // Save the current element hash
	            $arrayHashes[$hash] = $hash;
	            // Add element to the unique Array
	            if ($preserveKeys) {
	                $arrayRewrite[$key] = $item;
	            } else {
	                $arrayRewrite[] = $item;
	            }
	        }
	    }
	    return $arrayRewrite;
	}
	
	private function uniqueAssocArray($array, $uniqueKey) {
	  if (!is_array($array)) {
	    return array();
	  }
	  $uniqueKeys = array();
	  foreach ($array as $key => $item) {
	    if (!in_array($item[$uniqueKey], $uniqueKeys)) {
	      $uniqueKeys[$item[$uniqueKey]] = $item;
	    }
	  }
	  return $uniqueKeys;
	}
	
	public function carconfigureAction() {
		$jsonData = array();
		$colors = array();
		$trims = array();
		$accessories = array();
		$vehiclesByGrade = array();
		$riggingsByVehicle = array();
		$riggings = array();
		$vehicles = array();
		//Colors for Car
		if (null !== $this -> ColorSet) {
			foreach ($this->ColorSet as $Color => $Property) {
				$colors[] = array('color' => array('colorimages' => array('imageurl' => $Property['image']), 'colorname' => array('#text' => $Property['description']), 'rgbcolor' => array('#text' => $Property['rgb']), 'colorprice' => array('#text' => $Property['price']), 'colortrims' => array(), 'type' => array('#text' => $Property['type'])));
			}
		}
		//Trims for Car
		if (null !== $this -> TrimSet) {
			foreach ($this->TrimSet as $Trim => $Property) {
				$trims[] = array('trim' => array('image' => array('full' => $Property['full'], 'thumb' => $Property['thumb']), 'name' => array('#text' => $Property['name']), 'price' => array('#text' => $Property['price'])));
			}
		}
		//Accessories for Car
		if (null !== $this -> AccessorySet) {
			foreach ($this->AccessorySet as $Category => $Item) {
				foreach ($Item as $Accessory => $Property) {
					$accessories[] = array('accessory' => array('imagesacces' => array('accessoryimagethumb' => $Property['image_thumb'], 'accessoryimagefull' => $Property['image_full']), 'accessoryname' => array('mainname' => $Property['teaser']), 'sku' => array('num' => $Property['sku']), 'accessorydesc' => array('#cdata-section' => $Property['description']), 'accessoryprice' => array('value' => $Property['price'])));
				}
			}
		}
		if (null !== $this -> GradeSet) {
			foreach ($this->GradeSet as $gradeKey => $grade) {
				if (isset($this -> VehicleSet[$gradeKey])) {
					$vehiclesByGrade = $this -> VehicleSet[$gradeKey];
					foreach ($vehiclesByGrade as $vehicleKey => $vehicle) {
						if (isset($this -> RiggingSet[$vehicleKey])) {
							$riggingsByVehicle = $this -> RiggingSet[$vehicleKey];
							foreach ($riggingsByVehicle as $category) {
								foreach ($category as $item) {
									$riggings[$vehicleKey][] = array('category' => array('rigCategory' => array('name' => $item['category']), 'rigging' => array('riggingname' => array('rigname' => $item['name']), 'riggingtype' => array('#text' => $item['type']), 'riggingprice' => array('#text' => $item['price']))));
									//$riggings[$vehicleKey][] = array('category' => array('rigCategory' => array('name' => $item['category']), 'rigging' => array('riggingname' => array('#cdata-section' => $item['name']), 'riggingtype' => array('#text' => $item['type']), 'riggingprice' => array('#text' => $item['price']))));
									//$riggings[$vehicleKey][] = array('category' => array('name' => $item['category']), 'rigging' => array('riggingname' => array('#cdata-section' => $item['name']), 'riggingtype' => array('#text' => $item['type']), 'riggingprice' => array('#text' => $item['price'])));
								}
							}
							$vehicles[$gradeKey][] = array('vehicle' => array('name' => array('#text' => $vehicle['name']), 'fuel' => array('#text' => $vehicle['fuel']), 'engine' => array('#text' => $vehicle['engine']), 'transmission' => array('#text' => $vehicle['transmission']), 'price' => array('#text' => $vehicle['price']), 'colors' => $colors, 'trims' => $trims, 'riggings' => $riggings[$vehicleKey], 'accessories' => $accessories, 'body' => array('#text' => $vehicle['body']), 'doors' => array('#text' => $vehicle['doors'])));
						} else {
							$vehicles[$gradeKey][] = array('vehicle' => array('name' => array('#text' => $vehicle['name']), 'fuel' => array('#text' => $vehicle['fuel']), 'engine' => array('#text' => $vehicle['engine']), 'transmission' => array('#text' => $vehicle['transmission']), 'price' => array('#text' => $vehicle['price']), 'colors' => $colors, 'trims' => $trims, 'riggings' => $riggings, 'accessories' => $accessories, 'body' => array('#text' => $vehicle['body']), 'doors' => array('#text' => $vehicle['doors'])));
						}
					}
				}
				$jsonData[] = array('grade' => array('@attributes' => array('imageurl' => $grade['image']), 'gradename' => array('#text' => $grade['name']), 'vehicles' => $vehicles[$gradeKey]));
				
			}
		}		
		$this -> view -> assign(array('config' => array('model' => array('@attributes' => array('name' => $this -> Car -> name), 'grades' => $jsonData))));		
	}

}
