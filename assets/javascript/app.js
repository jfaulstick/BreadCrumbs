
// Section 1:
// global variables
// ============================================================================

// Var for tracking the total number of users.
var totalUsers;
// Var for tracking the user slot #
var userName;
// Boolean for tracking whether or not the browser is signed in as a user
var isSignedIn = false;
// Total number of 'It' users allowed at one time.
var totalIts = 1;
// Configurable location update time interval in milliseconds
var locationInterval = 30000;
// For setting the connected user reference
var userRef;

// Section 2:
// Firebase CDN
//  ===========================================================================
 // Initialize Firebase
var config = {
    apiKey: "AIzaSyCXu6muve1SKZFE9W0x7hvz3H_rmCJtgsQ",
    authDomain: "breadcrumbs-1513133131724.firebaseapp.com",
    databaseURL: "https://breadcrumbs-1513133131724.firebaseio.com",
    projectId: "breadcrumbs-1513133131724",
    storageBucket: "breadcrumbs-1513133131724.appspot.com",
    messagingSenderId: "769979061333"
  };
firebase.initializeApp(config);
  
var db = firebase.database();
var auth = firebase.auth();
var user = firebase.auth().currentUser;

function hideLogin() {
	$("#login-Row").hide();
}

function hideRegistration() {
	$("#registration-Row").hide();
}

function showLogin() {
	$("#login-Row").show();
}

function showRegistration() {
	$("#registration-Row").show();
}

// Sets the user variable and signed in boolean upon user sign-in.
function setUser() {
	user = firebase.auth().currentUser;
	isSignedIn = true;
	connectUser();
}

// Checks to see if the user is currently signed in.
function checkUser() {
	if (user) {
		console.log("Signed in as user " + user.email);
		console.log(user);
		hideLogin();
	} else {
		console.log("No user is signed in");
	}
}

// Adds the user's userName to the list of connectedUsers in firebase
function connectUser() {
	db.ref().child('connectedUsers/' + userName + "/connected").push(true);
	userRef = db.ref('connectedUsers/' + userName);
	userRef.onDisconnect().remove();
	console.log("User ref set to " + userRef);
}

// Section 3:
// functions
// =============================================================================

// When the user clicks the registration button..
$("#register_Me").on("click", function(){
	showRegistration();
	hideLogin();
});

$("#login").on("click", function(){
	hideRegistration();
	showLogin();
});

// 
// LOGIN USER
// When the user clicks the login button in the login form..
$("#user-Login").on("click", function(event){
	// Prevent default browser form behavior
	event.preventDefault();

	var loginEmail = $("#loginEmail").val().trim();
	var loginPassword = $("#loginPassword").val().trim();

	userName = loginEmail.substr(0, loginEmail.indexOf('@'));
	console.log(userName);

	// testing and debugging
	console.log("Email " + loginEmail);
	console.log("Password " + loginPassword);

	// pass user login info to firebase
	firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(errorCode);
	  console.log(errorMessage);
	});

	setUser();
	checkUser();

	// Get latest location and update firebase with user's lat and lng
	updateLocation();
	// Starts location update timer
	setLocationTimer();
	
});

// CREATE USER:
// When the user clicks the submit button in the registration form..
$("#user-SignUp").on("click", function(event){
	// prevent default behavior
	event.preventDefault();

	// grab the users form information and save to variables
	var name = $("#userName").val().trim();
	var userEmail = $("#userEmail").val().trim();
	var userPassword = $("#userPassword").val().trim();

	userName = userEmail.substr(0, userEmail.indexOf('@'));

	// tests and debugging
	console.log(userName);
	console.log(name);
	console.log(userEmail);
	console.log(userPassword);

	// Tempory JSON variable to hold the user information
	var newUser = {
		name: name,
		email: userEmail,
	};

	userSlot = totalUsers + 1;

	// send user login information to firebase
	db.ref().child('users/' + userName + '/name').set(name);
	db.ref().child('users/' + userName + '/email').set(userEmail);
	
	// Create user in firebase authentication
	auth.createUserWithEmailAndPassword(userEmail, userPassword);

	// Firebase tests and debugging
	setUser();
	checkUser();
	
	// Use firebase authentication listner to show current logged in user
	auth.onAuthStateChanged(function(user){
		if (user) {
			console.log("You are signed in");
			console.log(user);
		} else {
			console.log("Your are not signed in");
			console.log("Please log in");
		}
	})

	// alert user of signUp
	alert("Account successfully added!")

	// clear the form
	$("#userName").val("");
	$("#userEmail").val("");
	$("#userPassword").val("");

	// Show logout button when user logs in
	$("#user-Logout").show();

	// Get latest location and update firebase with user's lat and lng
	updateLocation();
	// Starts location update timer
	setLocationTimer();
});

// USER LOGOUT:
// When the user clicks the logout button
$("#user-Logout").on("click", function(){
	auth.signOut().then(function() {
		console.log("Sign-out successful.");
	}).catch(function(error){
		console.log("An error has occured when logging out.");
		console.log(error);
	})
});

// Section 4:
// Main process
// ================================================================================
// Hide the registration form from view
$("#registration-Row").hide();
// Hide the logout button
// $("#user-Logout").hide();

db.ref().on("value", function(snapshot) {
	totalUsers = snapshot.child('users').numChildren();
});