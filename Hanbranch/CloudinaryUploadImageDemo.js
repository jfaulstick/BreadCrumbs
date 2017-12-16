<script class= text/javascript> 

cloudinary.uploader().unsignedUpload("D:\DCIM\PathtrailerParkingspotPreferred.png", "unsigned_1") ); 
cloudinary.uploader().ObjectUtils.asMap("Sample.jpg" , ObjectUtils.emptyMap()); 

cloudinary.uploader().upload("Sample.jpg", 
    ObjectUtils.asMap("public_id", "my_folder/my_sub_folder/my_name"));

</script> 