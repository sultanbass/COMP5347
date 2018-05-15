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
  versionKey: false,
});

//Find total number of Revisions for each article
revSchema.statics.findNumRev= function(number, callback){
	var pipeline = [
		{$group: {_id:"$title", numOfRevisons: {$sum:1}}},
    {$limit:number},
		{$sort: {numOfRevsions:1}}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

// OVERALL STATS - BAR CHART QUERIES
// Find user's revisions that are in userList grouped by year
revSchema.statics.findRevByYearUser= function(userList, callback){
	var pipeline =
		[
			{$match: {user: {$in:userList}}},
			{$project: {"year": {$substrBytes: ["$timestamp", 0, 4]}}},
			{$group: {_id: "$year", count:{$sum:1}}},
			{$sort: {_id:1}}
		];
	return this.aggregate(pipeline).exec(callback);
};

// Find anon users' revisions grouped by year
revSchema.statics.findRevByYearAnon= function(callback){
	var pipeline =
		[
			{$match: {anon: {$exists: true}}},
			{$project: {"year": {$substrBytes: ["$timestamp", 0, 4]}}},
			{$group: {_id: "$year", count:{$sum:1}}},
			{$sort: {_id:1}}
		]
	return this.aggregate(pipeline).exec(callback);
};

//Find regular users' revisions grouped by year
revSchema.statics.findRevByYearRegUser= function(userList, callback){
	var pipeline =
		[
			{$match: {user: {$nin:userList}}},
			{$match: {anon: {$exists: false}}},
			{$project: {"year": {$substrBytes: ["$timestamp", 0, 4]}}},
			{$group: {_id: "$year", count:{$sum:1}}},
			{$sort: {_id:1}}
		]
	return this.aggregate(pipeline).exec(callback);
};

//OVERALL STATS - PIE CHART QUERIES
//Find user's revisions that are in userList
revSchema.statics.findRevByUser= function(userList, callback){
	var pipeline =
		[
			{$match: {user: {$in:userList}}},
			{$group: {_id: "Admin Users", count:{$sum:1}}}
		];
	return this.aggregate(pipeline).exec(callback);
};

// Find anon users' revisions
revSchema.statics.findRevByAnon= function(callback){
	var pipeline =
		[
			{$match: {anon: {$exists: true}}},
			{$group: {_id: "Anonymous", count:{$sum:1}}}
		]
	return this.aggregate(pipeline).exec(callback);
};

//Find regular users' revisions
revSchema.statics.findRevByRegUser= function(userList, callback){
	var pipeline =
		[
			{$match: {user: {$nin:userList}}},
			{$match: {anon: {$exists: false}}},
			{$group: {_id: "Regular Users", count:{$sum:1}}}
		]
	return this.aggregate(pipeline).exec(callback);
};

var Revision = mongoose.model('Revision', revSchema, 'revisions')

//Export the model Revision Schema
module.exports = Revision

//Find distinct registered users from article "CNN"
Revision.distinct('user', {'anon':{'$exists':false},'title':'CNN'}, function(err,users){
	if (err){
		console.log("Query error!")
	}else{
		console.log("There are " + users.length + " distinct users in CNN");
	}
})
