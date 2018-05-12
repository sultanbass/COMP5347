const mongoose = require('mongoose');

//Create schema for wiki pages
const revSchema = new mongoose.Schema ({
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

/*TEST FUNCTION
//Get names of all wikiarticles
wikiSchema.revisions.Titlename = function(callback){
	return this.distinct("title")
	.exec(callback)
};
*/

//Export the model wiki Schema
const Revision = module.exports = mongoose.model('Revision', revSchema);
