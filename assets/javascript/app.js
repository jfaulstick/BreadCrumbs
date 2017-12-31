
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
  
  // database reference
var db = firebase.database();
	// authentication reference
var auth = firebase.auth();
// firebase current user
var user = firebase.auth().currentUser;
// firebase user chatbox
var chatData = db.ref("/chat");


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

// Section 3:
// functions
// =============================================================================

console.log(user);

	
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

	user = firebase.auth().currentUser;

	// show the current logged in user when use logs in
	if (user) {
		console.log(user);
		hideLogin();
	} else {
		console.log("No user is signed in");
	}

});

// 
// CREATE USER:
// When the user clicks the submit button in the registration form..
$("#user-SignUp").on("click", function(event){
	// prevent default behavior
	event.preventDefault();

	// grab the users form information and save to variables
	var userName = $("#userName").val().trim();
	var userEmail = $("#userEmail").val().trim();
	var userPassword = $("#userPassword").val().trim();

	// tests and debugging
	console.log(userName);
	console.log(userEmail);
	console.log(userPassword);

	// Tempory JSON variable to hold the user information
	var newUser = {
		name: userName,
		email: userEmail
	};

	// send user login information to firebase
	db.ref("/users").push(newUser);
	// Create user in firebase authentication
	auth.createUserWithEmailAndPassword(userEmail, userPassword);

	// Firebase tests and debugging
	console.log(newUser.name);
	console.log(newUser.email);

	// Get firebase user key:
	console.log(token);
	
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
});

// 
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
// Hide the registration form from view
$("#registration-Row").hide();
// Hide the logout button
// $("#user-Logout").hide();