// Configure cloudinary
// var cl = new cloudinary.Cloudinary({cloud_name: "djzxhcr1g", upload_preset: "dzrlj6sb"});

$(document).ready(function () {
// $(“#cloudinary-input”).attr(“data-form-data”, jsonData);
console.log(Math.floor(Date.now() / 1000));
});

$(document).ready(function() {
  if($.fn.cloudinary_fileupload !== undefined) {
    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
  }
});

$(".cloudinary-fileupload").bind('cloudinarydone', function(e, data) {
	var id = data.result.public_id;
	var url = data.result.secure_url;
	console.log(data);
	console.log(id);
	console.log(url);
});
