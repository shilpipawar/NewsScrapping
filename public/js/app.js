//Scrape Button
$(document).on("click", ".scrape", function () {

  $("#news").empty();
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    console.log(data);
    alert("Scraped News!!")
  });
});

//Saved Article
$(document).on("click", ".save", function () {
  $("#news").empty();
  console.log("Article");
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles"
  }).then(function (data) {
    console.log("SHILPA" + data);
    for (var i = 0; i < data.length; i++) {
      $("#news").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<hr>"
        + "URL:" + data[i].newsURL +
        "</p>" + "<h3>" + "<a class='btn btn-success save btnSave'" + "data-id='" + data[i]._id + "'>"
        + 'Save Article' + "</a>" +
        "<a class='btn btn-success btnClear'" + "data-id='" + data[i]._id + "'>"
        + 'Clear Article' + "</a>"
        + "</h3>");
    }
  });
});

// Whenever someone clicks a p tag
$(document).on("click", ".btnSave", function () {
  // Empty the news from the note section
  $("#articles").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("Inside" + thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#articles").append("<h2>" + data.headline + "</h2>");
      // An input to enter a new title
      $("#articles").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#articles").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.article) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.article.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.article.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
console.log($("#titleinput").val());
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function (data) {
      console.log(data);
      $("#articles").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// db.users.deleteMany({})
$(document).on("click", ".clear", function () {
  console.log("CLEAR START");
  $.ajax({
    method: "DELETE",
    url: "/delete"
  }).then(function (data) {
   alert(data);
  });
});
//btnClear Click
$(document).on("click", ".btnClear", function () {
  console.log("ID CLEAR START");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  }).then(function (data) {
    console.log("ID CLEAR SUCCESS" + data);
    $("#data-id").empty();
    alert(data);
  });
});