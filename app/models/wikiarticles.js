const mongoose = require('mongoose');

//Create schema for wiki pages
const wikiSchema = new mongoose.Schema ({
  title:{
    type: String,
  },
  timestamp:{
    type: String,
  },
  user:{
    type: String,
  },
  anon:{
     type: String,
  },
});

var Wiki = mongoose.model('Wiki',wikiSchema, 'wikipedia')

//Export the model wiki Schema
module.exports = wikiSchema;
