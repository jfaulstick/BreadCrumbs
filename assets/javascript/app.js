// Section 1:
// global variables
// ============================================================================


// Section 2:
// Firebase CDN
//  ===========================================================================
  // Initialize Firebase
var config = {
    apiKey: "AIzaSyAWBH0WwUAruaTjaHGkJA51COcfO00TKGo",
    authDomain: "breadcrumbs-98358.firebaseapp.com",
    databaseURL: "https://breadcrumbs-98358.firebaseio.com",
    projectId: "breadcrumbs-98358",
    storageBucket: "breadcrumbs-98358.appspot.com",
    messagingSenderId: "320278007810"
  };
  firebase.initializeApp(config);

var db = firebase.database();
var auth = firebase.auth();


// Section 3:
// functions
// =============================================================================
// When the user clicks the submit button..
$("#user-SignUp").on("click", function(event){
	// prevent default behavior
	event.preventDefault();

	// grab the users form information and save to variables
	var userEmail = $("#userEmail").val().trim();
	var userPassword = $("#userPassword").val().trim();

	// tests and debugging
	console.log(userEmail);
	console.log(userPassword);

	// Tempory JSON variable to hold the user information
	// var newUser = {
	// 	email: userEmail,
	// 	password: userPassword
	// };

	// send user login information to firebase
	// db.ref("/users").push(newUser);
	auth.createUserWithEmailAndPassword(userEmail, userPassword);

	// Firebase tests and debugging
	// console.log(newUser.email);
	// console.log(newUser.password);

	// alert user of signUp
	alert("Account successfully added!")

	// clear the form
	$("#userEmail").val("");
	$("#userPassword").val("");
});


// Section 4:
// Main process
// ================================================================================
