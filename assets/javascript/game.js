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
// Total number of connected users
var connectedUsers = 0;

// Checks to see if an 'It' user exists
function checkIt() {
	if (itChecked == true) {
		return;
	}
	else if (itExists == false) {
		console.log("No IT exists!");
		addIt();
		itChecked = true;
	}
	else if (itExists == true && isIt == false) {
		itChecked = true;
		return;
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
		checkIt();
	}
}

// Function for adding the current user to the list of 'It' users in firebase
function addIt() {
	if (isIt == false) {
		isIt = true;
		setLocation();
		
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

function updateUserCount() {;
	var usersIt = connectedUsers - 1;
	$('#connectedUsersIt').text("There are " + usersIt + " seekers logged in and looking for you!");
	$('#connectedUsersSeeker').text("There are " + connectedUsers + " users logged in right now.");
};

function tagSuccess() {
	$('#tagMessageSeeker').text("You have found and TAGGED " + itUserName + "! Try to find out who they are in person!");
	$('#tagModalSeeker').modal("show");
	$('#tagDiv').hide();
};

function itTagged(name) {
	if (isIt == true) {
		$('#tagMessageIt').text(name + " has found and TAGGED you! Try to find out who they are in person!");
		$('#tagModalIt').modal("show");
		db.ref('tagger').remove();
	}
};

$('#tagButton').on("click", function() {
	db.ref('tagger').set(userName);
	taggerRef = db.ref('tagger');
	taggerRef.onDisconnect().remove();
	tagSuccess();
});

$('#tagModalSeekerDismiss').on("click", function() {
	$('#tagModalSeeker').modal("hide");
});

// Checks to see if a Seeker has tagged IT (by being added to the tagger object in firebase)
db.ref('tagger').on("value", function(snapshot) {
	if (snapshot.exists()) {
		var tagger = snapshot.val();
		tagger = String(tagger);
		itTagged(tagger);
	}
});

// Checks to see if there are any userNames added to the 'itList' object in firebase
db.ref('itList').on("value", function(snapshot) {
	if (snapshot.exists()) {
		itList = snapshot.val();
		var itListKeys = Object.keys(itList);
		itUserName = itListKeys[0];
		console.log("It's user name is " + itUserName);
		itExists = true;
		checkIfIt();
	}
	else if (isSignedIn == true) {
		addIt();
	}
});

db.ref('connectedUsers').on("value", function(snapshot) {
	if (snapshot.exists() && itExists == false) {
		var users = snapshot.val();
		var usersKeys = Object.keys(users);
		connectedUsers = usersKeys.length;
		console.log("Total number of connected users is " + usersKeys.length);
		updateUserCount();
	}
	else if (snapshot.exists() && itExists == true) {
		var users = snapshot.val();
		var usersKeys = Object.keys(users);
		connectedUsers = usersKeys.length;
		console.log("Total number of connected users is " + usersKeys.length);
		updateUserCount();
		isItOnline(users);
	}
});