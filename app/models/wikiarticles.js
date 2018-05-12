const mongoose = require('mongoose');

//Create schema for wiki pages
const wikiSchema = new mongoose.Schema ({
  title:{
    type: String,
    index: true,
  },
  timestamp:{
    type: String,
    index: true,
  },
  user:{
    type: String,
    index: true,
  },
  anon:{
     type: String,
     index: true,
  },
});

//Get names of all wikiarticles
wikiSchema.revisions.Titlename = function(callback){
	return this.distinct("title")
	.exec(callback)
};
//var Wiki = mongoose.model('Wiki',wikiSchema, 'wikipedia')

//Export the model wiki Schema
const Wiki = module.exports = mongoose.model('Revision', wikiSchema);
