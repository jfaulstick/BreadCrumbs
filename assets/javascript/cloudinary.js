// Configure cloudinary
$.cloudinary.config({ cloud_name: 'djzxhcr1g', upload_preset: "dzrlj6sb", secure: true});

$(document).ready(function() {

	if ($.fn.cloudinary_fileupload !== undefined) {
		$("input.cloudinary-fileupload[type=file]").unsigned_cloudinary_fileupload("dzrlj6sb", {
			cloud_name: 'djzxhcr1g',
			tags: 'browser_uploads' }
		});
	}
});

$(".cloudinary_fileupload").append($.cloudinary.unsigned_upload_tag("dzrlj6sb", {
	cloud_name: 'djzxhcr1g' }));
