var cloudName = "djzxhcr1g";
var version;
var id;
var format;
// Global variable for tracking whether an image is ready
var uploadComplete = false;

function resetURL() {
	url = "https://res.cloudinary.com/djzxhcr1g/image/upload/v1515035725/bread-2_qyscfk.jpg";
}

function displayModalImage(id, version, format) {
	var image = $("<img>");
	image.attr('src', "https://res.cloudinary.com/" + cloudName + "/image/upload/w_270,h_400/v" + version + "/" + id + "." + format);
	$("#modalImage").append(image);
	console.log("New image displayed!");
	console.log(image);
}

$(document).ready(function() { 
	$('.upload_form').append($.cloudinary.unsigned_upload_tag("dzrlj6sb", 
	  { cloud_name: 'djzxhcr1g' }));

	$('.upload_field').unsigned_cloudinary_upload("dzrlj6sb", { 
		cloud_name: 'djzxhcr1g', 
		tags: 'browser_uploads' 
		}, 
		{ multiple: false 
	}).bind('cloudinarydone', function(e, data) {
		version = data.result.version;
		id = data.result.public_id;
		format = data.result.format;
		url = "https://res.cloudinary.com/" + cloudName + "/image/upload/w_180,h_180,c_thumb,r_20/v" + version + "/" + id + "." + format;
		console.log(data);
		uploadComplete = true;
		displayModalImage(id, version, format);
	})
});