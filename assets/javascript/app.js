$(document).ready(function() {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHzVmBd6ctm9G-De54tslC7_xSiXc82GY",
    authDomain: "train-schedule-hwproject.firebaseapp.com",
    databaseURL: "https://train-schedule-hwproject.firebaseio.com",
    projectId: "train-schedule-hwproject",
    storageBucket: "train-schedule-hwproject.appspot.com",
    messagingSenderId: "6353914694"
  };
  firebase.initializeApp(config);

//   Database reference
  var database = firebase.database();

//   Variables for the Submit button
  var name;
  var destination;
  var firstTrain;
  var frequency = 0;

// Begin orginal code

  $("#add-train").on("click", function() {
      event.preventDefault();

    //   Store and receive user train input
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    // Pushing to database
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,        
    });
    // Clears the fields after clicking "Submit"
    $("form")[0].reset();
  });

// End orignal code

  database.ref().on("child_added", function(childSnapshot) {
      var nextArr;
      var minAway;

// Change the year so all inputs happen in the future. Per class exercise 21 "train-schedule"
// I misspelled "subtract!" It took forever to figure out why the inputs made it to the database but not the HTML.

      var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

    // Difference between the current time and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    
    // Minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;

    // Next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
    "</td><td>" + childSnapshot.val().destination + 
    "</td><td>" + childSnapshot.val().frequency + 
    "</td><td>" + nextTrain + 
    "</td><td>" + minAway + "</td></tr>");

  });

});