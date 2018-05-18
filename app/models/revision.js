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

// Find the most recent revision for an article
revSchema.statics.latestRevDate = function (_article,callback) {
	var pipeline =[
		{$match:{title:_article}},
		{$sort:{timestamp:-1}},
		{$limit:1},		
		{$project:{timestamp:1}}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

// Add a revision to the database
revSchema.statics.addRevision = function (revision,callback) {
	return this.updateOne(revision).exec(callback)
}

//Find highest number of Revisions for each article
revSchema.statics.findHighNumRev= function(number, callback){
	var pipeline = [
		{$group: {_id:"$title", count: {$sum:1}}},
		{$sort: {count:-1}},
		{$limit:number}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

//Find lowest number of Revisions for each article
revSchema.statics.findLowNumRev= function(number, callback){
	var pipeline = [
		{$group: {_id:"$title", count: {$sum:1}}},
		{$sort: {count:1}},
		{$limit:number}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};


//find the article edited by largest group of registered users
revSchema.statics.findMostUserEdits= function(callback){
	var pipeline = [
    {$match: {anon: {$exists: false}}},
    {$group:{_id:"$title", uniqueCount:{$addToSet:"$user"}}},
    {$unwind:"$uniqueCount"},
    {$group:{_id:"$_id", usercount:{$sum:1}}},
    {$sort:{usercount:-1}},
    {$limit:1}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

//find the article edited by smallest group of registered users
revSchema.statics.findLeastUserEdits= function(callback){
	var pipeline = [
    {$match: {anon: {$exists: false}}},
    {$group:{_id:"$title", uniqueCount:{$addToSet:"$user"}}},
    {$unwind:"$uniqueCount"},
    {$group:{_id:"$_id", usercount:{$sum:1}}},
    {$sort:{usercount:1}},
    {$limit:1}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

//find atop 3 article with the longest history
revSchema.statics.findLongRev= function(callback){
	var pipeline = [
		{$group:{_id:"$title", timestamp:{$last:"$timestamp"}}},
		{$sort:{timestamp:1}},
		{$limit:3}
	];
	return this.aggregate(pipeline)
	.exec(callback)
};

//Find top 3 articles with the shortest history
revSchema.statics.findShortRev= function(callback){
	var pipeline = [
		{$group:{_id:"$title", timestamp:{$last:"$timestamp"}}},
		{$sort:{timestamp:-1}},
		{$limit:3}
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
revSchema.statics.findRevByUser= function(userType, userList, callback){
	var pipeline =
		[
			{$match: {user: {$in:userList}}},
			{$group: {_id: userType, count:{$sum:1}}}
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
			{$group: {_id: "Regular User", count:{$sum:1}}}
		]
	return this.aggregate(pipeline).exec(callback);
};

var Revision = mongoose.model('Revision', revSchema, 'revisions')

//Export the model Revision Schema
module.exports = Revision
