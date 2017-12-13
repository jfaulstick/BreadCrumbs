var map;
var infoWindow;
var crumbCounter;

// Function that initializes the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
});

infoWindow = new google.maps.InfoWindow;

	// Get browser Geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// Set position to the browser's location
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			// infoWindow.setPosition(pos);
			// infoWindow.setContent('Location found.');
			// infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
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

// Adds new breadcrumb to breadcrumbList object in Firebase
function addCrumb(lat, lng) {
	var breadcrumb = {
		lat: lat,
		lng: lng
	};

	// Setting index value for new crumb
	var crumbIndex = crumbCounter - 1;

	db.ref('breadcrumbList/' + crumbIndex).set(breadcrumb);
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
}

// Submits a new breadcrumb. Currently off of a Submit button with values from two <divs>
function submitCrumb() {
	var lat = parseFloat($("#lat").val().trim());
	var lng = parseFloat($("#lng").val().trim());

	if (lat == "" || lng == "") {
		$("#crumbFormMsg").text("All fields must have proper values inputted.");
	}
	else {
		
		crumbCounter++;

		// Calls function to add the crumb to Firebase
		addCrumb(lat, lng);

		console.log("Form test successful!");
		console.log("Adding a new breadcrumb at Lat: " + lat + " / " + lng);
		$("#crumbFormMsg").empty();
	}
}

// At Launch or when breadcrumbList is updated, adds marker for each of last 10 breadcrumbs
db.ref('breadcrumbList').on("value", function(snapshot) {
	crumbCounter = snapshot.numChildren();
	
	if (snapshot.exists()) {
		var crumbList = snapshot.val();
		console.log("There are " + crumbList.length + "total breadcrumbs.");
		console.log(crumbList);

		var totalCrumbs = crumbList.length;

		// If there are more than 10 breadcrumbs in breadcrumbList on Firebase
		if (totalCrumbs > 10) {
			// Set the amount of breadcrumbs we will show to 10
			var crumbsToShow = 10;
			// Sets the starting object index to the total length - 10
			var startIndex = totalCrumbs - crumbList.length;
		}
		// If there are 10 or less breadcrumbs in breadcrumbList on Firebase
		else {
			// Set the amount of breadcrumbs to the number in Firebase
			crumbsToShow = totalCrumbs;
			// Set the starting object index to 0
			startIndex = 0;
		}

		for (i = 0; i < crumbsToShow; i++) {
			var lat = parseFloat(snapshot.child(startIndex + "/lat").val());
			var lng = parseFloat(snapshot.child(startIndex + "/lng").val());
			addMarker(lat, lng);
			startIndex++;
			console.log("Adding breadcrumb at index " + i + " at Lat: " + lat + " / Lng: " + lng);
		}
	}

});





