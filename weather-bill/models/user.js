var mongoose = require('mongoose');
// This Schema created a User profile
// User Schema
var UserSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  comment: {
    type: String
  }
});

var Page = module.exports = mongoose.model('User', UserSchema);
