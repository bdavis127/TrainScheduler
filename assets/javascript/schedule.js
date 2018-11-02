$(document).ready(function () {
  var time = moment();

  $('#time').html("The current time is: " + moment(time).format("hh:mm"));
  console.log(time);

  //moment().format('MMMM Do YYYY, h:mm:ss a');


  /*Initialize Firebase*/
  var config = {
    apiKey: "AIzaSyB3zE691nxZJ3wsl5v3SQzyitncz74Qdwg",
    authDomain: "train-schedule-33148.firebaseapp.com",
    databaseURL: "https://train-schedule-33148.firebaseio.com",
    projectId: "train-schedule-33148",
    storageBucket: "",
    messagingSenderId: "396155025746"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  $("#addNewTrain").click(function (event) {
    event.preventDefault()
    console.log("test")

    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#trainDestination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var trainFrequency = $("#trainFrequency").val().trim();
    console.log(trainName, trainDestination, firstTrainTime, trainFrequency);

    var newTrainInfo = {
      trainName: trainName,
      trainDestination: trainDestination,
      firstTrainTime: firstTrainTime,
      trainFrequency: trainFrequency
    }

    database.ref().push(newTrainInfo);
    $(".form-control").val("");
  });

  setInterval( function() {
    $("#trainTableData").empty();
    database.ref().on("child_added", function (snap) {
      var allTrainData = snap.val();
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(allTrainData.firstTrainTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % allTrainData.trainFrequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = allTrainData.trainFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
      nextTrain = moment(nextTrain).format("hh:mm");

      $("#trainTableData").append(
        `<tr>
      <td>${allTrainData.trainName}</td>
      <td>${allTrainData.trainDestination}</td>
      <td>${allTrainData.trainFrequency}</td>
      <td>${nextTrain}</td>
      <td>${tMinutesTillTrain}</td>
     </tr>`
      );
    })






  },function (err) { console.log(err) }, 60000);

})

