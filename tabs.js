$(document).ready(function() {
    var passengerTab = $('#frmMain > fieldset > div.n-head > ul > li:nth-child(1)');
	var commenrcialTab = $('#frmMain > fieldset > div.n-head > ul > li:nth-child(2)');
	var passengerCars = $('#frmMain > fieldset > div.categoryParsys.parsys > div:nth-child(1)');
	var commercialCars = $('#frmMain > fieldset > div.categoryParsys.parsys > div:nth-child(2)');
	commercialCars.hide();
	
	
	
	//When passenger button is clicked
	passengerTab.on('click', function(event)
	{
		event.stopImmediatePropagation();
		var $this = $(this);
		$this.addClass('on');
		commenrcialTab.removeClass('on');
		commercialCars.stop().slideUp();	
		passengerCars.stop().slideDown();
	});
	
	//When commercial button is clicked
	commenrcialTab.on('click', function( event )
	{
		event.stopImmediatePropagation();
		var $this = $(this);
		$this.addClass('on');
		passengerTab.removeClass('on');	
		passengerCars.stop().slideUp();
		commercialCars.stop().slideDown();
	});
	
	//$('#region').attr('onchange', "handleRegion(this)");
	//$('#municipal').attr('onchange', "handleMunicipal(this)");
	
	//<div class="form-row cf">
	$('#content_wrapper > form').attr('id', 'testdrive');
	$('#content_wrapper > form').addClass('testdrive');
	$('#content_wrapper > form').append('<div class="form-row cf">');
	
	$('#fieldset-personaldetails').appendTo('#content_wrapper > form > div.form-row').addClass('first');
	$('#content_wrapper > form > div.form-row').addClass('first');
	$('#fieldset-contactpreferences').appendTo('#content_wrapper > form > div.form-row');
	$('#fieldset-personaldetails > dl').append('<div class="box form-box cf"></div>');
	$('#fieldset-personaldetails > dl > div.form_item').appendTo('#fieldset-personaldetails > dl > div.box.form-box.cf');
	
	$('#fieldset-contactpreferences > dl').append('<div class="box form-box cf"></div>');
	
	$('#fieldset-contactpreferences > dl > div.form_item').appendTo('#fieldset-contactpreferences > dl > div.box.form-box.cf');
	
	$('#fieldset-contactpreferences > dl > p').appendTo('#fieldset-contactpreferences > dl > div');
	
	$('#content_wrapper > form').append('<div class="form-row cf second">');
	
	$('#fieldset-message, #fieldset-optin, #fieldset-phoneoptin').appendTo('#content_wrapper > form > div.form-row.cf.second');
	
	$('#fieldset-message > dl').append('<div class="box form-box cf"></div>');
	
	$('#fieldset-message > dl > div.form_item').appendTo('#fieldset-message > dl > div.box.form-box.cf');
	
	$('#content_wrapper > form').append('<div class="form-row cf third">');
	
	$('#content_wrapper > form').append('<div class="form-row cf fourth">');
	
	$('#fieldset-disclaimer, #fieldset-submitSet').appendTo('#testdrive > div.form-row.cf.third');
	
	$('#fieldset-optin > dl > div').append('<span class="form_item cf"></span>');
	
	$('#title > option').eq(0).attr('value', "");

	$('#mobile').addClass('tin');
	$('#phone').addClass('tin');
	$('#mobile').removeAttr('value');
	$('#phone').removeAttr('value');
	
	$('select').addClass('select');
	
	var gmarkers = [];
	
	var regionArray = [];
	var municipalArray = [];
	
	
	 var gicons = [];
    var map = null;
    
    var Athens = new google.maps.LatLng(37.90465769755854, 23.772354125976562);
    
    var infowindow = new google.maps.InfoWindow({
        size: new google.maps.Size(750,550),
        maxWidth: 1500
    });
    
    gicons["red"] = new google.maps.MarkerImage("mapIcons/marker_red.png",
    // This marker is 20 pixels wide by 34 pixels tall.
    new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    new google.maps.Point(0,0),
    // The anchor for this image is at 9,34.
    new google.maps.Point(9, 34));
    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.
    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    
    var iconImage = new google.maps.MarkerImage('mapIcons/marker_red.png',
    // This marker is 20 pixels wide by 34 pixels tall.
    new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    new google.maps.Point(0,0),
    // The anchor for this image is at 9,34.
    new google.maps.Point(9, 34));
    
    var iconShadow = new google.maps.MarkerImage('http://www.google.com/mapfiles/shadow50.png',
    // The shadow image is larger in the horizontal dimension
    // while the position and offset are the same as for the main image.
    new google.maps.Size(37, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(9, 34));
    // Shapes define the clickable region of the icon.
    // The type defines an HTML &lt;area&gt; element 'poly' which
    // traces out a polygon as a series of X,Y points. The final
    // coordinate closes the poly by connecting to the first
    // coordinate.
    
    var iconShape = {
        coord: [9,0,6,1,4,2,2,4,0,8,0,12,1,14,2,16,5,19,7,23,8,26,9,30,9,34,11,34,11,30,12,26,13,24,14,21,16,18,18,16,20,12,20,8,18,4,16,2,15,1,13,0],
        type: 'poly'
    };
	
	function createMarker(latlng,name,category,region, municipal) {
        var marker = new google.maps.Marker({
            position: latlng,
            //icon: gicons[category],
            //shadow: iconShadow,
            map: map,
            title: name,
            zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        
        // === Store the category and name info as a marker properties ===
        marker.mycategory = category;
        marker.myregion = region;
        marker.mymunicipal = municipal;                                  
        marker.myname = name;
        gmarkers.push(marker);
        
    }
	
	function initialize() {
        
        setVisibilityMinicipalFieldFalse();
        
        var addRegionArray = [];
        var addMunicipalArray = [];
      	var uniqueRegion;
      	var uniqueUnicipal;
      	
      	var prev; 
      	var count = 0;
      	var viewHelper;
      	var viewHelperMun; 
        
        // Loading the XML File
        downloadUrl("/xml/network.xml", function(doc) {
            var xml = doc.responseXML;
            var markers = xml.documentElement.getElementsByTagName("marker");
            
            for (var i = 0; i < markers.length; i++) 
            {
                // obtain the attribues of each marker
                var name = markers[i].getAttribute("name");
                var region = markers[i].getAttribute("region");
                var municipal = markers[i].getAttribute("municipal");
                var category = '';
                
                var point = new google.maps.LatLng(
                parseFloat(markers[i].getAttribute("lat")),
                parseFloat(markers[i].getAttribute("lon"))
                ); 
                
                console.log(region);
                
                var prev;
                
                var marker = createMarker(point,name,category,region, municipal);
                
                addRegionArray.push(region);
                
              }
            
            uniqueRegion = GetUnique(addRegionArray);
            
            var stringRegionHelper = renderOptionValues(uniqueRegion);
            
            renderRegionLinks(stringRegionHelper);
            
            $('#region').change(function()
			{
				handleRegion(this);
			});
            
            $('#municipality').change(function()
			{
				handleMunicipal(this);
			});
           // == show or hide the categories initially ==
            //hide();
            //show();
            
        });
	}
	
	initialize();
	
	
	//$('#municipality > option').eq(0).attr('value', "");
	
	$('#testdrive').validate({
        rules: {
        	
        	region:
        	{
        		required: true
        	},
        	title: {
				required: true
			},
            firstname: "required",
            lastname: "required",
            
            mobile: {
            	number: true,
            	require_from_group: [1, ".tin"],
            	minlength: 10,
            	phoneEnding6: true 
            },
		    phone: {
		    	number: true,
		     	require_from_group: [1, ".tin"],
		     	minlength: 10,
		     	phoneEnding210: true 
            	
		    },
		    email: {
                required: true,
                email: true
            },
            /*comment: {
            	required: true,
            	
            },*/
            confirmmobilephone:
            {
            	required: true,
            }
        },
        groups: {
		    tin: "mobile phone"
		},
        // Specify the validation error messages
        messages: {
            //testdrivedatedesirable:"Παρακαλώ επιλέξτε ημερομηνία",
            region:"Παρακαλώ επιλέξτε περιοχή",
            title:"Παρακαλώ επιλέξτε τον τίτλο",
            firstname: "Παρακαλώ πληκτρολογήστε ένα όνομα",
            lastname: "Παρακαλώ πληκτρολογήστε ένα επώνυμο",
            email: "Παρακαλώ πληκτρολογήστε μιά έγκυρη ηλεκτρονική διεύθυνση",
            //comment: "Παρακαλώ πληκτρολογήστε ένα μήνυμα",
            confirmmobilephone: "",
            mobile:"Παρακαλώ πληκτρολογήστε ένα απο τα δυό πεδία 'μόνο αριθμούς'",
            phone:"Παρακαλώ συμπληρώστε ένα απο τα δυό πεδία 'μόνο αριθμούς'"
             
        },
        
        submitHandler: function(form) {
            form.submit();
        }
    });
    
    function renderRegionLinks(katitis){
    	
    	var regionDiv = document.getElementById("region");
    	regionDiv.innerHTML = '<option selected="selected"> --Επιλέξτε-- </option>' +  katitis; 
    	
    }
    
    function renderMunicipalLinks(katitis){
    	
    	var regionDiv = document.getElementById("municipality");
    	
    	regionDiv.innerHTML =  '<option selected="selected"> --Επιλέξτε-- </option>' + katitis; 
    	
    }
    
    function doNothing() {}
    function setVisibilityMinicipalFieldTrue()
    {
    	$('#municipality').show();
    }
    
    function setVisibilityMinicipalFieldFalse()
    {
    	$('#municipality').hide();
    }
    
    // == hides all markers of a particular category, and ensures the checkbox is cleared ==
    function hide(category) {
        if (category) {
            for (var i=0; i<gmarkers.length; i++) {
                if (gmarkers[i].mycategory == category) {
                    gmarkers[i].setVisible(false);
                }
            }
        } else {
            for (var i=0; i < gmarkers.length; i++) {
                gmarkers[i].setVisible(false);
            }
        }
        // == close the info window, in case its open on a marker that we just hid
        infowindow.close();
    }
    
    function handleSelected(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            show(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
    function handleRegion(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            showRegion(selectedCat);
        	feedMunicipality(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
    function feedMunicipality(test)
    {
    	var emptyArray = [];
    	var uniqueArray = [];
    	var theResult;
    	if (test){
    		for (var i=0; i < gmarkers.length; i++) {
    			if (gmarkers[i].myregion == test) {
    				emptyArray.push(gmarkers[i].mymunicipal);
    			}
    		}
    		uniqueArray = GetUnique(emptyArray);
    		theResult = renderOptionValues(uniqueArray);
    		setVisibilityMinicipalFieldTrue();
    		renderMunicipalLinks(theResult);
    		
    		console.log(uniqueArray);

    	}else{
    		return null;
    	}
    	
    	
    }
    
    function handleMunicipal(opt) {
        var i = opt.selectedIndex - 1;
        var selectedCat = opt.value; 
        
        if (i > -1) {
            showMunicipal(selectedCat);
        }
        else {
            infowindow.close();
        }
    }
    
     function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
        
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };
        
        request.open('GET', url, true);
        request.send(null);
    }
    
    function GetUnique(inputArray)
	{
		var outputArray = [];
					
		for (var i = 0; i < inputArray.length; i++)
			{
				if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
				{
					outputArray.push(inputArray[i]);
				}
			}
			return outputArray;
	}
    
    // == shows all markers of a particular category, and ensures the checkbox is checked ==
    function show(category) {
    	hide();
    	if (category) {
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].mycategory == category) {
    				gmarkers[i].setVisible(true);
    				//map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}
    }
    
    function showRegion(filter) {
    	hide();
    	if (filter){
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].myregion == filter) {
    				gmarkers[i].setVisible(true);
    				//map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}    	
    }
    
    function showMunicipal(filterMun) {
    	hide();
    	if (filterMun){
    		for (var i=0; i<gmarkers.length; i++) {
    			if (gmarkers[i].mymunicipal == filterMun) {
    				gmarkers[i].setVisible(true);
    				//map.panTo(gmarkers[i].getPosition());
    			}
    		}
    	}else{
    		for (var i=0; i<gmarkers.length; i++) {
    			gmarkers[i].setVisible(true);    			
    		}
    	}    	
    }
    
    function renderOptionValues(inputArray)
	  {
	  	if(inputArray.length > 0)
	  	{
	  		var viewHelper;
	  		for(var i = 0; i < inputArray.length; i++)
				{
					viewHelper = viewHelper + '<option value="'+inputArray[i]+'">'+inputArray[i]+'</option>';
				}
			return	viewHelper;
		}else
		{
			return null;
		}		
	  }
     //$.validator.format("Please fill at least {0} of these fields.");
     //$.validator.addMethod("require_from_group", $.validator.methods.required, "Ενα απο τα δύο πεδία πρέπει να συμπληρωθεί");
    jQuery.validator.addMethod("require_from_group", function (value, element, options) {
        var numberRequired = options[0];
        var selector = options[1];
        var fields = $(selector, element.form);
        var filled_fields = fields.filter(function () {
            // it's more clear to compare with empty string
            return $(this).val() != "";
        });
        var empty_fields = fields.not(filled_fields);
        // we will mark only first empty field as invalid
        if (filled_fields.length < numberRequired && empty_fields[0] == element) {
            return false;
        }
        return true;
        // {0} below is the 0th item in the options field
    }, jQuery.format("Παρακαλώ πληκτρολογήστε ένα απο τα δυό πεδία 'αριθμό'"));
	
	jQuery.validator.addMethod("phoneEnding6", function(phone_number, element) {
	    phone_number = phone_number.replace(/\s+/g, ""); 
	    return this.optional(element) || phone_number.match(/^69\d{8,}$/);
	}, "Phone number should start with 69");
	jQuery.validator.addMethod("phoneEnding210", function(phone_number, element) {
	    phone_number = phone_number.replace(/\s+/g, ""); 
	    return this.optional(element) || phone_number.match(/^21\d{8,}$/);
	}, "Phone number should start with 210");
	
});
	