// Boolean for checking if an 'It' exists
var itExists = new Boolean(false);
// Boolean for determining if the user is 'It'
var isIt = new Boolean(false);
// List of current 'It' users
var itList = [];
// Boolean for seeing if 'It' has been checked for upon login
var itChecked = new Boolean(false);
// Stores IT's username
var itUserName;
// Boolean for checking to see if 'It' is online.
var itOnlineStatus = new Boolean(false);

// Checks to see if an 'It' user exists
function checkIt() {
	if (itExists == false) {
		console.log("No IT exists!");
		addIt(userName);
		console.log(itList);
		itChecked = true;
	}
	else if (itExists == true && isIt == true) {
		console.log("The user is IT!");
		itChecked = true;
	}
	else {
		console.log("The user is NOT IT!");
		itChecked = true;
	}
};

function checkIfIt() {
	if (!itList) {
		return;
	}
	else if (userName in itList) {
		isIt = true;
		itChecked = true;
	}
}

// Function for adding the current user to the list of 'It' users in firebase
function addIt() {
	if (isIt == false) {
		db.ref('itList').child(userName).set(true);
		isIt = true;
		console.log("You are IT!");
	}
	else {
		console.log("User is already IT!");
	}
};

function isItOnline(users) {
	console.log(users);
	if (itUserName in users) {
		itOnlineStatus = true;
		console.log("IT is online!");
		$('#itOnlineStatus').text("IT is online!");
	}
	else {
		itOnlineStatus = false;
		console.log ("IT is NOT online!");
		$('#itOnlineStatus').text("IT is NOT online!");
	}
};

// Checks to see if there are any userNames added to the 'itList' object in firebase
db.ref('itList').on("value", function(snapshot) {
	itList = snapshot.val();
	itExists = true;
});

db.ref('connectedUsers').on("value", function(snapshot) {
	if (snapshot.exists() && itChecked == false) {
		var users = snapshot.val();
		console.log(users);
		if (userName in users && isSignedIn == true && itChecked == false && itExists == true) {
			checkIfIt();
		}
		else if (isIt == false && itChecked == false && itExists == true) {
			checkIt();
			console.log("isIT = false, itChecked = false, itExists = true");
		}
		else if (isIt == true) {
			console.log("User is IT. No need to check for other ITs");
			itChecked = true;
		}
		else {
			console.log("Something went wrong when determining if there's an IT");
		}
	}
	if (itExists == true) {
		isItOnline(users);
	}
});

db.ref('itList').on("value", function(snapshot) {
	if (snapshot.exists()) {
		itList = snapshot.val();
		var itListKeys = Object.keys(itList);
		itUserName = itListKeys[0];
		console.log("It's user name is " + itUserName);
		itExists = true;
	}
	else {
		itExists = false;
	}
});