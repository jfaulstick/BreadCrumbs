var map, infoWindow;

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
			// Set a map marker to the browser's location
			var marker = new google.maps.Marker({
				position: pos,
				map: map
			});

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

function submitCrumb() {
	var lat = $("#lat").val().trim();
	var lng = $("#lng").val().trim();

	if (lat == "" || lng == "") {
		$("#crumbFormMsg").text("All fields must have proper values inputted.");
	}
	else {
		console.log("Form test successful!");
		console.log("Adding a new breadcrumb at Lat: " + lat + " / " + lng);
		$("#crumbFormMsg").empty();
	}

}





