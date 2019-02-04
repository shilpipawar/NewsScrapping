var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NewsSchema = new Schema({
  // Headline - the title of the article
  Headline: String,
  // Summary - a short summary of the article
  Summary: String,
  //URL - the url to the original article
  newsURL: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NewsSchema);

// Export the Note model
module.exports = Note;
