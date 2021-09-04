'use strict';
var jsonstr;
var app = angular.module('myApp', ['ngAnimate', 'angular.filter']);
app.service("JsonService", function($http, $q) {
    var JsonArray = [];
    var getUrl = window.location;
    var url = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1] + '/' + theCar + '/format/json';
    var deferred = $q.defer();
    $http.get(url).then(function(data) {
        deferred.resolve(data);
    });
    this.getJson = function() {
        return deferred.promise;
    };
    this.setArray = function(myArray) {
        JsonArray.push(myArray);
    };
    this.getArray = function() {
        return JsonArray;
    };
}).directive('loading', ['$http', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function(value) {
                if (value) {
                    element.removeClass('loaded');
                } else {
                    element.addClass('loaded');
                }
            });
        }
    };
}]).filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
}).filter('uniqueCat', function() {
    return function(input, key) {
        var unique = {};
        var uniqueList = [];
        for (var i = 0; i < input.length; i++) {
            if (typeof unique[input[i][key]] == "undefined") {
                unique[input[i][key]] = "";
                uniqueList.push(input[i]);
            }
        }
        return uniqueList;
    };
}).filter('priceMin', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            keys.push(key);
            output.push(Math.min.apply(Math, item));
        });
        return output;
    };
}).filter('num', function() {
    return function(input) {
        return parseInt(input);
    };
}).filter('uniq', function() {
    return function(arr, field) {
        return _.uniq(arr, function(a) {
            return a[field];
        });
    };
}).filter('customuniqueFilter', function() {
    return function(array, propertyThatMustBeUnique) {
        var newArray = [];
        for (i = 0; i++; i < array.length) {
            if (array.indexOf(i) === -1) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    };
}).filter('setDecimal', function($filter) {
    return function(input, places) {
        if (isNaN(input)) return input;
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
}).directive('clear', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind("click", function(e) {
                e.preventDefault();
                $('li#accessories').removeClass('option-selected');
            });
        }
    };
}).controller('myGrades', function($scope, JsonService, $timeout, $filter, $sce) {
    var promise = JsonService.getJson();
    $scope.parseInt = parseInt;
    $scope.setGrade = function(grade) {
        $scope.useGrade = grade;
        $scope.selectedAccesories.splice(0, $scope.selectedAccesories.length);
    };
    $scope.setVehicle = function(myvehicle) {
        $scope.useVehicle = myvehicle;
        $scope.useVehicleRig = myvehicle;
        $scope.selectedAccesories.splice(0, $scope.selectedAccesories.length);
        $scope.categoryRig = [];
        $scope.cateroryName = [];
        angular.forEach($scope.useVehicleRig.vehicle.riggings, function(myrigging, index) {
            $scope.categoryRig.push(myrigging.category.rigCategory.name);
            $scope.cateroryName.push(myrigging.category.rigging.riggingname.rigname);
        });
        $scope.HTML1 = [];
        var prev;
        $scope.cat = [];
        $scope.equip = [];
        for (var i = 0; i < $scope.cateroryName.length; i++) {
            if ($scope.categoryRig[i] != prev) {
                $scope.HTML1.push("<h5 style='text-transform: none;' aria-controls='technical-specification-category-details-0' class='category-name' role='button' tabindex='0'>" + "<strong>" + $scope.categoryRig[i] + "</strong>" + "</h5>");
            }
            prev = $scope.categoryRig[i];
            $scope.HTML1.push("<div aria-expanded='false' class='category-details' id='technical-specification-category-details-0'>" + "<div class='category-detail'>" + "<dl>" + "<dt class='name'>" + $scope.cateroryName[i] + "</dt>" + "</dl>" + "</div>" + "</div>");
        }
        for (var i = 0; i < $scope.HTML1.length; i++) {
            $scope.HTML1[i] = $sce.trustAsHtml($scope.HTML1[i]);
        }
    };
    $scope.setColor = function(color) {
        $scope.useColor = color;
    };
    $scope.setVehiclePrice = function(vehicleprice) {
        $scope.useVehiclePrice = vehicleprice;
    };
    $scope.setAccessory = function(accessory) {
        $scope.useAccessory = accessory;
    };
    promise.then(function(data) {
        $scope.bornJSON = data;
        $scope.myconfig = data.config;
        $scope.config = $scope.bornJSON.data.config;
        $scope.categoryVehicle = $scope.bornJSON.data.category;
        $scope.modelName = $scope.bornJSON.data.config.model['@attributes'].name;
        $scope.newgrades = [];
        $scope.initialGrades = [];
        $scope.imageurl = [];
        $scope.myvehicleArray = [];
        $scope.VehicleColor = [];
        $scope.VehiclePrice = [];
        $scope.VehicleColorImageUrl = [];
        $scope.output = [];
        $scope.AccesoriesPrices = [];
        $scope.min = 0;
        $scope.max = 0;
        $scope.today = new Date();
        $scope.sortColumn = 'value';
        $scope.init = function() {
            $scope.str = 'Ζάντα';
            $scope.str1 = 'Ζάντες';
            $scope.str2 = 'ζάντα';
        };
        angular.forEach($scope.config.model.grades, function(mygrades, index) {
            $scope.newgrades.push(mygrades.grade);
            angular.forEach(mygrades.grade.vehicles, function(myvehicle, index) {
                $scope.myvehicleArray.push(myvehicle);
                $scope.VehiclePrice.push(myvehicle.vehicle.price['#text']);
                angular.forEach(myvehicle.vehicle.colors, function(mycolor, index) {
                    $scope.VehicleColor.push(mycolor);
                    $scope.VehicleColorImageUrl.push(mycolor.color.colorimages.imageurl);
                });
                angular.forEach(myvehicle.vehicle.riggings, function(myrigging, index) {});
                angular.forEach(myvehicle.vehicle.accessories, function(myaccessory, index) {
                    $scope.skuNum = 'myaccessory.accessory.accessoryprice.value';
                    $scope.AccesoriesPrices.push(parseFloat(myaccessory.accessory.accessoryprice.value).toFixed(2));
                });
            });
        });
        $scope.deselectAccessory = function(myaccessory) {
            var index = $scope.selectedAccesories.indexOf(myaccessory);
            if (index >= 0) {
                $scope.selectedAccesories.splice(index, 1);
            }
        };
        $scope.manageAccessories = function() {
            var total = [];
            for (var i = 0; i < $scope.selectedAccesories.length; i++) {
                var product = $scope.selectedAccesories[i];
                var str = product.accessory.accessoryname.mainname;
                if (str.indexOf("Ζάντα") !== -1 || str.indexOf("Ζάντες") !== -1) {
                    total.push(parseInt(product.accessory.accessoryprice.value * 1.24) * 4);
                } else {
                    total.push(parseInt(product.accessory.accessoryprice.value * 1.24));
                }
            }
            return total;
        };
        $scope.resetAccessory = function(element) {
            $scope.selectedAccesories.splice(0, $scope.selectedAccesories.length);
        };
        $scope.selectAccessory = function(myaccessory) {
            $scope.selectedAccesories.push(myaccessory);
        };
        $scope.getTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.selectedAccesories.length; i++) {
                var product = $scope.selectedAccesories[i];
                var str = product.accessory.accessoryname.mainname;
                if (str.indexOf("Ζάντα") !== -1 || str.indexOf("Ζάντες") !== -1) {
                    total += (product.accessory.accessoryprice.value * 1.24) * 4;
                   //console.log(product.accessory.accessoryname.mainname);
                } else {
                    total += product.accessory.accessoryprice.value * 1.24;
                }
            }
            return total;
        };
        $scope.printDiv1 = function(div) {
            var docHead = document.head.outerHTML;
            var printContents = document.getElementById(div).outerHTML;
            var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";
            var newWin = window.open("", "_blank", winAttr);
            var writeDoc = newWin.document;
            writeDoc.open();
            writeDoc.write('<!doctype html><html>' + docHead + '<body onLoad="window.print()">' + printContents + '</body></html>');
            writeDoc.close();
            newWin.focus();
        };
        $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var theCar = $scope.modelName;
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var popupWin = window.open('', '_blank', 'width=1000,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.window.focus();
                popupWin.document.write('<!DOCTYPE html><html><head>' + '<title>Nissan - Νικ. Ι. θεοχαράκης</title><meta charset="UTF-8"><link href="/skin/css/builder/fonts-latin-basic.min.css" media="screen" rel="stylesheet" type="text/css">' + '<link href="/skin/css/builder/print_cfg.min.css" media="all" rel="stylesheet" type="text/css">' + '</head><body onload="window.focus(); window.print(); window.close();"><main id="container" role="main" ng-app="myApp" class="ng-scope">' + printContents + '</main></body></html>');
                popupWin.onbeforeunload = function(event) {
                    popupWin.close();
                    return '.\n';
                };
                popupWin.onabort = function(event) {
                    popupWin.document.close();
                    popupWin.close();
                };
            } else {
                var popupWin = window.open('', '_blank', 'width=1000,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.document.open();
                popupWin.document.write('<!DOCTYPE html><html><head>' + '<title>Nissan - Νικ. Ι. θεοχαράκης</title><meta charset="UTF-8"><link href="/skin/css/builder/fonts-latin-basic.min.css" media="screen" rel="stylesheet" type="text/css">' + '<link href="/skin/css/builder/print_cfg.min.css" media="all" rel="stylesheet" type="text/css">' + '</head><body onload="window.focus(); window.print(); window.close();"><main id="container" role="main" ng-app="myApp" class="ng-scope">' + printContents + '</main></body></html>');
                popupWin.document.close();
            }
            popupWin.document.close();
            return true;
        };
        $scope.TotalAmountAccessories = 0;
        $scope.selectedAccesories = [];
        $scope.thecounter = 0;
        $scope.Fuel = [];
        $scope.Price = [];
        $scope.Name = [];
        $scope.Engine = [];
        $scope.Trans = [];
        $scope.BodyWork = [];
        $scope.mygradesderective = [];
        $scope.grades = [];
        $scope.mygrades = [];
        $scope.myGradeVehicles = [];
        $scope.minRangeGradePrice = [];
        if ($scope.config.model['@attributes'].name != "") {
            if ($scope.config.model.grades instanceof Array) {
                for (var i = 0; i < $scope.config.model.grades.length; i++) {
                    $scope.grades.push($scope.config.model.grades[i].grade.gradename['#text']);
                    $scope.imageurl.push($scope.config.model.grades[i].grade['@attributes'].imageurl);
                    $scope.mygrades.push($scope.config.model.grades[i].grade);
                    $scope.setMyGrades = JsonService.setArray($scope.mygrades);
                    $scope.getMyGrades = JsonService.getArray();
                    if ($scope.config.model.grades[i].grade.vehicles instanceof Array) {
                        for (var j = 0; j < $scope.config.model.grades[i].grade.vehicles.length; j++) {
                            $scope.Fuel.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.fuel['#text']);
                            $scope.Price.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.price['#text']);
                            $scope.Name.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.name['#text']);
                            $scope.Engine.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.engine['#text'].toString());
                            $scope.Trans.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.transmission['#text']);
                            $scope.myGradeVehicles.push($scope.config.model.grades[i].grade.vehicles[j].vehicle);
                            if ($scope.categoryVehicle == 'lcvs') {
                                $scope.BodyWork.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.body['#text']);
                            } else {
                                $scope.BodyWork.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.doors['#text']);
                            }
                            $scope.thecounter += 1;
                        }
                        $scope.minRangeGradePrice.push(Math.min.apply(Math, $scope.Price));
                        emptyArrays($scope, $scope.Fuel, $scope.Price, $scope.Name, $scope.Engine, $scope.Trans, $scope.BodyWork);
                    }
                }
            } else {
                $scope.grades.push($scope.config.model.grades.grade.gradename['#text']);
                $scope.imageurl.push($scope.config.model.grades.grade['@attributes'].imageurl);
            }
        }
    });
}).controller("ItemController", function($scope, JsonService) {
    $scope.deactivate = function() {
        if ($scope.isSelected) {
            return;
        }
        $scope.isShowingAccessoryName = false;
    };
    $scope.activate = function() {
        $scope.isShowingAccessoryName = true;
    };
    $scope.toggleSelection = function() {
        $scope.isSelected = !$scope.isSelected;
        if ($scope.isSelected) {
            $scope.selectAccessory($scope.myaccessory);
            for (var i = 0; i < $scope.selectedAccesories.length; i++) {
                $scope.totalAccessories += parseFloat($scope.selectedAccesories[i].accessory.accessoryprice.value);
            };
        } else {
            $scope.deselectAccessory($scope.myaccessory);
        }
    };
    $scope.isShowingAccessoryName = false;
    $scope.isSelected = false;
    $scope.totalAccessories = 0;
}).directive("toggleClass", function() {
    return {
        link: function($scope, element, attr) {
            element.on("click", function(event) {
                element.addClass("option-selected").siblings().removeClass("option-selected");
                $scope.vehicleFuel = [];
                $scope.vehiclePrice = [];
                $scope.vehicleName = [];
                $scope.vehicleEngine = [];
                $scope.vehicleTrans = [];
                $scope.vehicleBodyWork = [];
                var findGrade = element.find("span.cfg-option-title-detail.ng-binding").text();
                if ($scope.config.model.grades instanceof Array) {
                    for (var i = 0; i < $scope.config.model.grades.length; i++) {
                        var indexOfGradeArray = $scope.grades.indexOf(findGrade);
                        if (i == indexOfGradeArray) {
                            $scope.mygradesderective.push($scope.config.model.grades[i].grade);
                           //console.log($scope.mygradesderective);
                            if ($scope.config.model.grades[i].grade.vehicles instanceof Array) {
                                for (var j = 0; j < $scope.config.model.grades[i].grade.vehicles.length; j++) {
                                    $scope.vehicleFuel.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.fuel['#text']);
                                    $scope.vehiclePrice.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.price['#text']);
                                    $scope.vehicleName.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.name['#text']);
                                    $scope.vehicleEngine.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.engine['#text'].toString());
                                    $scope.vehicleTrans.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.transmission['#text']);
                                    //console.log("Name " + $scope.vehicleName);
                                    if ($scope.categoryVehicle == 'lcvs') {
                                        $scope.vehicleBodyWork.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.body['#text']);
                                    } else {
                                        $scope.vehicleBodyWork.push($scope.config.model.grades[i].grade.vehicles[j].vehicle.doors['#text']);
                                    }
                                    $scope.thecounter += 1;
                                /}
                                emptyArrays($scope, $scope.vehicleFuel, $scope.vehiclePrice, $scope.vehicleName, $scope.vehicleEngine, $scope.vehicleTrans, $scope.vehicleBodyWork);
                            }
                        }
                    }
                }
            });
        }
    };
}).controller('firstViewCtrl', function($scope, JsonService) {
    var promise = JsonService.getJson();
    $scope.getGrades;
    $scope.getImageURL;
    $scope.vehiclePrice = [];
    $scope.minRangeGradePrice;
    $scope.getMyGrades = JsonService.getArray();
    $scope.setGrade = function(grade) {
        $scope.useGrade = grade;
    };
    $scope.setVehicle = function(vehicle) {
        $scope.useVehicle = vehicle;
    };
    promise.then(function(data) {
        $scope.getMyGrades = data;
        $scope.JsonGrades = $scope.getMyGrades.data.config.model.grades;
        $scope.newgrades = [];
        $scope.initialGrades = [];
        $scope.imageurl = [];
        $scope.myvehicleArray = [];
        $scope.VehicleColor = [];
        $scope.VehicleColorImageUrl = [];
        angular.forEach($scope.JsonGrades, function(mygrades, index) {
            $scope.newgrades.push(mygrades.grade);
            angular.forEach(mygrades.grade.vehicles, function(myvehicle, index) {
                $scope.myvehicleArray.push(myvehicle);
                angular.forEach(myvehicle.vehicle.colors, function(mycolor, index) {
                    $scope.VehicleColor.push(mycolor);
                    $scope.VehicleColorImageUrl.push(mycolor.color.colorimages.imageurl);
                });
            });
        });
        if ($scope.JsonGrades instanceof Array) {
            for (var i = 0; i < $scope.JsonGrades.length; i++) {
                if (i == 0) {
                    $scope.getGrades = $scope.JsonGrades[i].grade.gradename['#text'];
                    $scope.getImageURL = $scope.JsonGrades[i].grade['@attributes'].imageurl;
                    if ($scope.JsonGrades[i].grade.vehicles instanceof Array) {
                        for (var j = 0; j < $scope.JsonGrades[i].grade.vehicles.length; j++) {
                            $scope.vehiclePrice.push($scope.JsonGrades[i].grade.vehicles[j].vehicle.price['#text']);
                        }
                        $scope.minRangeGradePrice = Math.min.apply(Math, $scope.vehiclePrice);
                    }
                }
            }
        }
    });
});
var emptyArrays = function($scope, array1, array2, array3, array4, array5, array6) {
    $scope.Fuel.splice(0, $scope.Fuel.length);
    $scope.Price.splice(0, $scope.Price.length);
    $scope.Name.splice(0, $scope.Name.length);
    $scope.Engine.splice(0, $scope.Engine.length);
    $scope.Trans.splice(0, $scope.Trans.length);
    $scope.BodyWork.splice(0, $scope.BodyWork.length);
};
var myAjaxCall = function($scope) {
    $.ajax({
        url: 'http://www.nissan.gr/carbuilder/' + theCar + '/format/json',
        async: false,
        dataType: 'json',
        success: function(jsonObj) {
            $scope.jsonstr = jsonObj;
        }
    });
};
var getData = function(url, $http, $q) {
    var data = "";
    var deferred = $q.defer();
    $http.get(url).success(function(response, status, headers, config) {
        deferred.resolve(response);
    }).error(function(errResp) {
        deferred.reject({
            message: "Really bad"
        });
    });
    return deferred.promise;
};
