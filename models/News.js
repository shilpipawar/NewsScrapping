var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NewsSchema = new Schema({
  // Headline - the title of the article
  headline:  {
    type: String,
    required: true
  },
  // Summary - a short summary of the article
  // Summary: String,
  //URL - the url to the original article
  newsURL:  {
    type: String,
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Export the Note model
module.exports = News;
