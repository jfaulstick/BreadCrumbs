// Boolean for checking if an 'It' exists
var itExists = new Boolean(false);
// Boolean for determining if the user is 'It'
var isIt = new Boolean(false);
// List of current 'It' users
var itList = [];
// Boolean for seeing if 'It' has been checked for upon login
var itChecked = new Boolean(false);

// Checks to see if an 'It' user exists
function checkIt() {
	if (itExists == false) {
		console.log("No IT exists!");
		addIt(userName);
		console.log(itList);
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

// Checks to see if there are any userNames added to the 'itList' object in firebase
db.ref('itList').on("value", function(snapshot) {
	itList = snapshot.val();
	itExists = true;
});

db.ref('connectedUsers').on("value", function(snapshot) {
	if (snapshot.exists() && itChecked == false) {
		var users = snapshot.val();
		console.log(users);
		if (userName in users && isSignedIn == true) {
			checkIfIt();
		}
		if (isIt == false) {
			checkIt();
		}
		else {
			console.log("User is IT. No need to check for other ITs");
		}
	}
});

db.ref('itList').on("value", function(snapshot) {
	if (snapshot.exists()) {
		itList = snapshot.val();
		itExists = true;
	}
	else {
		itExists = false;
	}
});