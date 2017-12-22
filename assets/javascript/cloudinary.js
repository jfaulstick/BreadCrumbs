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
