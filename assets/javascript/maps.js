var map;
var infoWindow;
// Array to hold the list of breadcrumbs
var crumbList = new Array();
// Configurable value to control how many breadcrumbs are shown
var crumbsToShow = 10;
// Array to hold the breadcrumb markers
var markersArray = [];
// Array for handling the user's location markers
var locationArray = [];
// Boolean for tracking whether the user's location has been initially logged
var locationLogged = new Boolean(false);
// Object for handling the user's position
var pos = {};
// Object for handling It's position
var posIt = {};
// Location Update Timer
var locationTimer;
// Distance between the user and IT in miles
var distanceToIt;
// Distance between the user and IT in meters
var distanceToItMeters
// Target distance for being able to TAG IT
var targetDistance = 0.001;

// Function that initializes the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 9,
		streetViewControl: false
});

infoWindow = new google.maps.InfoWindow;

	// Get browser Geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( function(position) {
			// Set position to the browser's location
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

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

// Centers the map
function mapCenter() {
	map.setCenter(pos);
}

// Updates variable pos with the user's current geolocation coordinates
function getLocation() {
	// Get browser Geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( function(position) {
			// Set position to the browser's location
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			locationLogged = true;
			// return pos;
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	}
	else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

// Updates firebase with current user's pos location.
function setLocation() {
	if (isSignedIn == true && isIt == true) {
		db.ref().child('connectedUsers/' + userName + '/pos/lat').set(pos.lat);
		db.ref().child('connectedUsers/' + userName + '/pos/lng').set(pos.lng);
		db.ref().child('itList/' + userName + '/pos/lat').set(pos.lat);
		db.ref().child('itList/' + userName + '/pos/lng').set(pos.lng);
		console.log("Updated user location to " + pos.lat + " / " + pos.lng);
	}
	else if (isSignedIn == true && isIt == false) {
		db.ref().child('connectedUsers/' + userName + '/pos/lat').set(pos.lat);
		db.ref().child('connectedUsers/' + userName + '/pos/lng').set(pos.lng);
		console.log("Updated user location to " + pos.lat + " / " + pos.lng);
	}
	else {
		console.log("ERROR: Tried to set geolocation while not signed in.");
	}
}

// Sets the current time to a local variable
function setConnectTime() {
	var now = moment().format("YYYYMMDDHmmss");
	if (isSignedIn == true && isIt == true) {
		db.ref().child('connectedUsers/' + userName + '/lastConnected').set(now);
		db.ref().child('itList/' + userName + '/lastConnected').set(now);
	}
	else if (isSignedIn == true && isIt == false) {
		db.ref().child('connectedUsers/' + userName + '/lastConnected').set(now);
	}
	else {
		console.log("ERROR: Tried to set connection time while not signed in.");
	}
}

// Gets the user's location and updates it in firebase.
function updateLocation() {
	console.log("Updating Location");
	getLocation();
	setLocation();
	getLocationText(pos.lat, pos.lng);
	removeLocationMarker();
	setConnectTime();
	addMarker(pos.lat, pos.lng, 'userLocation');

	if (isIt == false) {
		getDistance();
		updateItDistance();
		checkTagDistance();
	}
}

function checkTagDistance() {
	if (distanceToItMeters < targetDistance && itOnlineStatus == true) {
		console.log(userName + " is close enough to TAG IT!");
		$('#tagMessage').text("You are CLOSE enough to it!");
		showTagDiv();
	}
}

// Updates the user's location on a set interval if signed in.
function setLocationTimer() {
	if (isSignedIn === true) {
		console.log("Starting location update timer.");
		locationTimer = setInterval(updateLocation, locationInterval);
	}
	else {
		console.log("Not signed in. Location not registered");
	}
}

// Removes the markers stored in markersArray from the map.
function clearOverlays() {
	for (i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}	

// Creates an error window if geolocation fails or the browser does not support geolocation
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

// Adds new breadcrumb to breadcrumbList object in Firebase
function addCrumb(user, lat, lng, url) {
	var breadcrumb = {
		user: userName,
		lat: lat,
		lng: lng,
		url: url
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
function addMarker(lat, lng, feature) {
	// Sets marker latitude and longitude
	var myLatLng = {lat: lat, lng: lng};

	// Icons based on type for the map
	var icons = {
		breadcrumb: {
			url: 'assets/images/bread-flat.png',
			scaledSize: new google.maps.Size(30, 30),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(0, 15),
			title: 'Breadcrumb',
			zIndex: 0,
		},
		userLocation: {
			url: 'assets/images/youarehere.png',
			scaledSize: new google.maps.Size(30, 30),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(0, 15),
			title: 'You are here',
			zIndex: 1,
		}
	};

	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: icons[feature],
		title: icons[feature].title
	});

	if (feature == 'breadcrumb') {
		markersArray.push(marker);
	}
	else {
		locationArray.push(marker);
	}
}

function removeLocationMarker() {
	if (locationLogged == true) {
		locationArray[0].setMap(null);
		locationArray = [];
	}
}

// Updates the Seeker screen to show distance to IT's location
function updateItDistance() {
	if (itOnlineStatus == true) {
		$('#itDistance').text("You are " + distanceToIt + " miles from IT's current location.");
		console.log("User is " + distanceToIt + " miles from IT's current location.");
	}
	else {
		$('#itDistance').text("You are " + distanceToIt + " miles from IT's last known location.");
		console.log("User is " + distanceToIt + " miles from IT's last known location.");
	}
}

// Use the Haversine formula to detect distance in meters between two coordinates
var rad = function(x) {
	return x * Math.PI / 180;
}

var getDistance = function() {
	var R = 6378137; // Earth's mean radius in meters
	var dLat = rad(posIt.lat - pos.lat);
	var dLng = rad(posIt.lng - pos.lng);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(pos.lat)) * Math.cos(rad(posIt.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // d = distance in meters
	var m = d * 0.00062137; // Convert meters to miles
	distanceToItMeters = d;
	distanceToIt = m.toFixed(2);
	updateItDistance();
	return m.toFixed(2); // returns the distance in miles
}

function getLocationText(lat, lng) {
	var pos = lat + ',' + lng;

	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		data: {
			'latlng': pos,
		},
		dataType: 'json',
		success: function(r) {
			var text = r.results[0].formatted_address;
			setLocationText(text);
		},
		error: function(e) {
			console.log('ERROR: ', e);
		}
	})
}

function setLocationText(text) {
	$('#locationText').text("Current Location: " + text);
}

$("#submit-crumb").on("click", function() {
	$("#modalImage").empty();
	$("#crumbMsg").empty();
	$("#myModal").modal("hide");
	imageReady = false;
	getLocation();
	addCrumb(userName, pos.lat, pos.lng, url);
});

$("#cancel-crumb").on("click", function() {
	$("#modalImage").empty();
	$("#crumbMsg").empty();
});

// At Launch or when breadcrumbList is updated, adds marker for each of last 10 breadcrumbs
db.ref('breadcrumbList').on("value", function(snapshot) {
	crumbList = snapshot.val();
	clearOverlays();
	
	if (snapshot.exists()) {
		console.log("There are " + crumbList.length + " total breadcrumbs.");

		for (i = 0; i < crumbList.length; i++) {
			var lat = crumbList[i].lat;
			var lng = crumbList[i].lng;
			var type = 'breadcrumb';
			addMarker(lat, lng, type);
			console.log("Adding breadcrumb in index " + i + " at Lat: " + lat + " / Lng: " + lng);
		}
	}
});

db.ref('itList').on("value", function(snapshot) {
	if (snapshot.exists()) {
		var itList = snapshot.val();
		var itListKeys = Object.keys(itList);
		var itName = itListKeys[0];
		posIt = itList[itName].pos;
		console.log("IT's location is Lat: " + posIt.lat + "/ Lng: " + posIt.lng);
	}
});