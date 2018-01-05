
// Section 1:
// global variables
// ============================================================================

// Var for tracking the total number of users.
var totalUsers;
// Var for tracking the user slot #
var userName;
// Boolean for tracking whether or not the browser is signed in as a user
var isSignedIn = false;
// Configurable location update time interval in milliseconds
var locationInterval = 10000;
// For setting the connected user reference
var userRef;
// The user's dynamic key in firebase
var userKey;
// Global variable for storing URL of last uploaded image
var url;
// Global variable for tracking whether an image is ready
var imageReady = false;

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

// OpenWeathermap API Key
var weatherAPI = "7ba14572e11469af41df5fe3e624d755";
  
var db = firebase.database();
var auth = firebase.auth();
var user = firebase.auth().currentUser;

function showLoginScreen() {
	$("#loginScreen").show();
}

function hideLoginScreen() {
	$("#loginScreen").hide();
}

function showLogoutButton() {
	$("#user-Logout").show();
}

function hideLogoutButton() {
	$("#user-Logout").hide();
}

function showLoginButton() {
	$("#login").show();
}

function hideLoginButton() {
	$("#login").hide();
}

function showRegisterButton() {
	$("#register_Me").show();
}

function hideRegisterButton() {
	$("#register_Me").hide();
}

function showItScreen() {
	$("#itScreen").show()
}

function hideItScreen() {
	$("#itScreen").hide();
}

function showSeekerScreen() {
	$("#seekerScreen").show();
}

function hideSeekerScreen() {
	$("#seekerScreen").hide();
}

function showTagDiv() {
	$("#tagDiv").show();
}

function hideTagDiv() {
	$("#tagDiv").hide();
}

function displayScreen() {
	hideLoginButton();
	hideRegisterButton();
	showLogoutButton();
	if (isIt == true) {
		showItScreen();
	}
	else {
		showSeekerScreen();
	}
}

function hideScreen() {
	hideItScreen();
	hideSeekerScreen();
	hideLogoutButton();
	showLoginButton();
	showRegisterButton();
	showLoginScreen();
}

// Sets the user variable and signed in boolean upon user sign-in.
function setUser() {
	user = firebase.auth().currentUser;
	isSignedIn = true;
	checkIfIt();
	checkIt();
	connectUser();
	displayScreen();
}

function signOutUser() {
	userRef.remove();
	isSignedIn = false;
	isIt = false;
	userName = "";
	userRef = "";
	hideScreen();
}

// Checks to see if the user is currently signed in.
function checkUser() {
	if (user) {
		console.log("Signed in as user " + user.email);
		// console.log(user);
		hideLoginScreen();
	} else {
		console.log("No user is signed in");
	}
}

// Adds the user's userName to the list of connectedUsers in firebase
function connectUser() {
	db.ref('connectedUsers').child(userName).set(true);
	userRef = db.ref('connectedUsers').child(userName);
	userRef.onDisconnect().remove();
	// console.log("User ref set to " + userRef);
}

function disconnectUser() {
	if (isSignedIn == true) {
		$.ajax({
			url: config.databaseURL + "/testAjax/users/" + userKey.name + "/.json",
			data: userKey,
			type: "DELETE",
			success: function() {
				console.log(userName + " at key " + userKey + " erased from Firebase");
			},
			error: function(error) {
				console.log("error: " +error);
			}
		});
		return null;
	}
	else {
		return null;
	}
}

function clearRegisterForm() {
	$("#userName").val("");
	$("#userEmail").val("");
	$("#userPassword").val("");
}

function clearLoginForm() {
	$("#login-email").val("");
	$("#login-password").val("");
}

function setUserName(email) {
	var userNameUncased = email.substr(0, email.indexOf('@'));
		userName = userNameUncased.toLowerCase();
}

// Section 3:
// functions
// =============================================================================

// When the user clicks the registration button..
// $("#register_Me").on("click", function(){
// 	showRegistration();
// 	hideLogin();
// });

// 
// LOGIN USER
// When the user clicks the login button in the login form..
$("#user-Login").on("click", function(event){
	// Prevent default browser form behavior
	event.preventDefault();

	var loginEmail = $("#loginEmail").val().trim();
	var loginPassword = $("#loginPassword").val().trim();

	if (loginEmail !== "" && loginPassword !== "") {

		setUserName(loginEmail);

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
		$("#loginModal").modal("hide");
	}
	else {
		console.log("Login form missing some information.");
		$("#loginMessage").text("No fields can be empty!");
	}
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

	if (name !== "" && userEmail !== "" && userPassword !== "") {

		setUserName(userEmail);

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
		});

		// alert user of signUp
		console.log("Account successfully added!")

		// clear the form
		clearRegisterForm();

		// Show logout button when user logs in
		$("#user-Logout").show();

		// Get latest location and update firebase with user's lat and lng
		updateLocation();
		// Starts location update timer
		setLocationTimer();
		$("#registerModal").modal("hide");
	}
	else {
		console.log("Register form missing some information.");
		$("#registerMessage").text("No fields can be empty!");
	}
});

$("#cancel-register").on("click", function() {
	clearRegisterForm();
});

$("#cancel-login").on("click", function() {
	clearLoginForm();
});

// USER LOGOUT:
// When the user clicks the logout button
$("#user-Logout").on("click", function(){
	auth.signOut().then(function() {
		console.log("Sign-out successful.");
		signOutUser();
	}).catch(function(error){
		console.log("An error has occured when logging out.");
		console.log(error);
	})
});

// Section 4:
// Main process
// ================================================================================

// Hide It and Seeker screens and display Login screen on startup
hideItScreen();
hideSeekerScreen();
hideLogoutButton();
showLoginScreen();
hideTagDiv();

// Get the total number of users
db.ref().on("value", function(snapshot) {
	totalUsers = snapshot.child('users').numChildren();
});