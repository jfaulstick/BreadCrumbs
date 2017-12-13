function initMap() {
	var uluru = {lat: 38.0600888, lng: -122.5152275}

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: uluru
	});

	var marker = new google.maps.Marker({
		position: uluru,
		map: map
	});

}

