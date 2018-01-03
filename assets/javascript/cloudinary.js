// Configure cloudinary
// var cl = new cloudinary.Cloudinary({cloud_name: "djzxhcr1g", upload_preset: "dzrlj6sb"});
var cloudName = "djzxhcr1g";

function displayModalImage(id, version, format) {
	var image = $("<img>");
	image.attr('src', "https://res.cloudinary.com/" + cloudName + "/image/upload/w_270,h_400/v" + version + "/" + id + "." + format);
	$("#modalImage").append(image);
	console.log("New image displayed!");
	console.log(image);
}

$(document).ready(function() {
  if($.fn.cloudinary_fileupload !== undefined) {
    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
  }
});

$(".cloudinary-fileupload").bind('cloudinarydone', function(e, data) {
	url = data.result.secure_url;
	var id = data.result.public_id;
	var version = data.result.version;
	var format = data.result.format;
	console.log(data);
	console.log("Image ID: " + id);
	console.log("Image Version: " + version);
	console.log("Image Format: " + format);
	console.log("Image URL: " + url);
	imageReady = true;
	$("#crumbMsg").empty();
	displayModalImage(id, version, format);
});
