const mongoose = require('mongoose');

//schema to store users
const UserSchema = mongoose.Schema({
  first_name:{
    type: String,
    required: true
  },
  last_name:{
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

//var User = mongoose.model('User',userSchema, 'wikipedia')

//Export the model user Schema

const User = module.exports = mongoose.model('User', UserSchema);

//Export the model user Schema
//module.exports = userSchema;
