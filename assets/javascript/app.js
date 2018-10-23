// Initialize Firebase
var config = {
apiKey: "AIzaSyB2FycAv1XDD9bQZ6j3YYwaLwT_NllTl8Y",
authDomain: "traintime-559f8.firebaseapp.com",
databaseURL: "https://traintime-559f8.firebaseio.com",
projectId: "traintime-559f8",
storageBucket: "traintime-559f8.appspot.com",
messagingSenderId: "486901228589"
};
firebase.initializeApp(config);

var database = firebase.database().ref();

// primary "on click" event
$("#addT").on("click", function() {
    event.preventDefault();
    // Grabs user input
    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "hh:mm A").subtract(10, "years").format("X");
    var frequency = $("#frequencyInput").val().trim();
    // creates object for new train from the input
    var newT = {
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }
    // pushes new train to database
    database.push(newT);
    // clear forms
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");
    return false;
});

// "child added" event does the time calculation and generates HTML every time a new train is added to firebase
database.on("child_added", function(childSnapshot) {
    // Calculation
    var snap = childSnapshot.val();
    var names = snap.name;
    var trainD = snap.destination;
    var trainF = snap.frequency;
    var theFirstTrain = snap.firstTrain;
    var tDiff = moment().diff(moment.unix(theFirstTrain), "minutes") % trainF;
    var tMin = trainF - tDiff;
    var nArrival = moment().add(tMin, "m").format("hh:mm A");
    // HTML generation
    $("#trSched").append("<tr><td class='center'>" + names + "</td><td class='center'>" + trainD + "</td><td class='center'>" + trainF + "</td><td class='center'>" + nArrival + "</td><td class='center'>" + tMin + "</td></tr>");
});