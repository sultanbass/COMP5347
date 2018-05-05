const mongoose = require('mongoose');

//schema to store users
const UserSchema = mongoose.Schema({
  first name:{
    type: String,
    required: true
  },
  last name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

var Wiki = mongoose.model('User',userSchema, 'wikipedia')

//Export the model user Schema
module.exports = userSchema;
