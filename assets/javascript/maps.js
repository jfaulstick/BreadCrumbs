var map;
var infoWindow;
var crumbList = new Array();
var crumbsToShow = 10;
var markersArray = [];

// Function that initializes the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
});

infoWindow = new google.maps.InfoWindow;

	// Get browser Geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( function(position) {
			// Set position to the browser's location
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			logLocation(pos.lat, pos.lng);

			infoWindow.setPosition(pos);

			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} 
	else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function logLocation(lat, lng) {
	console.log("Current user's location is Lat: " + lat + " / Lng: " + lng);
}

function getLocation() {
	// Get browser Geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( function(position) {
			// Set position to the browser's location
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			logLocation(pos.lat, pos.lng);

			return pos;
		});
	}
}

function clearOverlays() {
	for (i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}	

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

// Adds new breadcrumb to breadcrumbList object in Firebase
function addCrumb(lat, lng) {
	var breadcrumb = {
		lat: lat,
		lng: lng
	};

	// If there are fewer index entries than the variable crumbsToShow, just add the new breadcrumb
	if (!crumbList) {
		crumbList = new Array(breadcrumb);
	}
	else if (crumbList.length < crumbsToShow) {
		crumbList.push(breadcrumb); 
	}
	// If number of index entries is equal or greater than crumbsToShow, remove the first entry and then add the new breadcrumb
	else {
		crumbList.shift();
		crumbList.push(breadcrumb);
	}

	db.ref('breadcrumbList').set(crumbList);
}

// Adds a new map marker to the map
function addMarker(lat, lng) {
	// Sets marker latitude and longitude
	var myLatLng = {lat: lat, lng: lng};

	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'Breadcrumb'
	});
	markersArray.push(marker);
}

// Submits a new breadcrumb. Currently off of a Submit button with values from two <divs>
$("#crumbInput").on("click", function() {
	var lat = parseFloat($("#lat").val().trim());
	var lng = parseFloat($("#lng").val().trim());

	if (lat == "" || lng == "") {
		$("#crumbFormMsg").text("All fields must have proper values inputted.");
	} 
	else {
		// Calls function to add the crumb to Firebase
		addCrumb(lat, lng);

		console.log("Form test successful!");
		console.log("Adding a new breadcrumb at Lat: " + lat + " / " + lng);
		$("#crumbFormMsg").empty();
	}
}

// At Launch or when breadcrumbList is updated, adds marker for each of last 10 breadcrumbs
db.ref('breadcrumbList').on("value", function(snapshot) {
	crumbList = snapshot.val();
	clearOverlays();
	
	if (snapshot.exists()) {
		console.log("There are " + crumbList.length + " total breadcrumbs.");
		console.log(crumbList);

		for (i = 0; i < crumbList.length; i++) {
			var lat = crumbList[i].lat;
			var lng = crumbList[i].lng;
			addMarker(lat, lng);
			console.log("Adding breadcrumb in index " + i + " at Lat: " + lat + " / Lng: " + lng);
		}
	}

});