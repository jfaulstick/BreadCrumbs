
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
var locationInterval = 30000;
// For setting the connected user reference
var userRef;
// Global variable for storing URL of last uploaded image
var url;
// Global variable for tracking whether an image is ready
var imageReady = false;

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
  

  // database reference
=======

var db = firebase.database();
	// authentication reference
var auth = firebase.auth();
// firebase current user
var user = firebase.auth().currentUser;
// firebase user chatbox
var chatData = db.ref("/chat");


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

function clearRegisterForm() {
	$("#userName").val("");
	$("#userEmail").val("");
	$("#userPassword").val("");
}

function clearLoginForm() {
	$("#login-email").val("");
	$("#login-password").val("");
}

// Section 3:
// functions
// =============================================================================

console.log(user);

	
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

		userName = loginEmail.substr(0, loginEmail.indexOf('@'));

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

<<<<<<< HEAD
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
=======
	if (name !== "" && userEmail !== "" && userPassword !== "") {

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
>>>>>>> 91539b2e44876e02763005b2057ae57f5ca2fef5

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


// 
// Player chatbox 
// When the users clicks the chat submit button..w
$("#chat-Send").click(function(){
	
	if ($("#chat-Input").val() !== "") {
		var message = $("#chat-Input").val();

	// tests and debugging
	console.log(message);

	chatData.push({
		name: userName,
		message: message,
		time: firebase.database.ServerValue.TIMESTAMP
	});

	// empty chatbox
	$("#chat-Input").val("")
	}
});
// When the user presses the enter -- input listner
$("#chat-Input").keypress(function(e){

	if (e.keyCode === 13 && $("#chat-Input").val() !== ""){

		var message = $("#chat-Input").val(); 
		userName = $("#userName").val().trim();

		chatData.push({
		name: userName,
		message: message,
		time: firebase.database.ServerValue.TIMESTAMP
	});

	$("#chat-Input").val("")

	}
});

// Update chat on text screen when new message detected
chatData.orderByChild("time").on("child_added", function(snapshot){

	$("#chat-Messsages").append("<p class= player" + snapshot.val().name + "<span>" + snapshot.val().message + "</span></p>");

	// Keep the chatbox div scrolled to bottom on each update
	$("#chat-Messsages").scrollTop($("#chat-Messsages")[0].scrollHeight);
});


// Section 4:
// 
// ================================================================================

// Hide It and Seeker screens and display Login screen on startup
hideItScreen();
hideSeekerScreen();
hideLogoutButton();
showLoginScreen();

// Get the total number of users
db.ref().on("value", function(snapshot) {
	totalUsers = snapshot.child('users').numChildren();
});