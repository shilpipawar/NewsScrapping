var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3030;
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const mongoUrl = 'mongodb://localhost/mongoHeadlines'
// Database configuration with mongoose
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect(mongoUrl)
}
// Routes
app.get("/scrape", function(req, res) {
  axios.get("https://www.washingtonpost.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".headline").each(function(i, element) {
      var result = {};
      result.headline = $(this)
        .children("a")
        .text();
      result.newsURL = $(this)
        .children("a")
        .attr("href");
      // Create a new Article using the `result` object built from scraping
      db.News.create(result)
        .then(function(dbNews) {
          console.log(dbNews);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete!!");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.News.find({})
    .then(function(dbArticle) { 
      //console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
    //res.send("Saved Articles");
});

app.get("/articles/:id", function(req, res) {
  console.log("Article by id");
  db.News.findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  console.log(req.body);
  db.Article.create(req.body)
    .then(function(dbArticle) {
      return db.News.findOneAndUpdate({ _id: req.params.id }, { article: dbArticle._id }, { new: true });
    })
    .then(function(dbNews) {
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Clear - db.users.deleteMany({})
app.delete("/delete", function(req, res) {
  db.News.deleteMany({})
    .then(function(result) { 
      console.log(result);
    })
    .catch(function(err) {
      res.json(err);
    });
    res.send("Deleted All Saved News");
});
//Clear by id
app.delete("/delete/:id", function(req, res) {
  db.News.findOneAndDelete({ _id: req.params.id })
    .then(function(result) {
     console.log(result);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    res.send("Deleted Selected Saved Article");
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
