/*let users = [];
// example {id: 132141321243, name: 'Sam Jones', email: 'sj524@email.com'}
const addUser = (ev) => {
  ev.preventDefault(); // to stop form setSubmitting
  let user = {
      id: Date.now(),
      name: document.getElementById('name').value,
      email: document.getElementById('email').value
  }
  users.push(user);
  //document.forms[0].reset(); // to clear the form for the next entries
  document.querySelector('form').reset();

  // for display purposes only
  console.warn('added', {users} );
  let pre = document.querySelector('#msg pre');
  pre.textContent = '\n' + JSON.stringify(users, '\t', 2);

  //saving to localStorage
  localStorage.setItem('MyUserList', JSON.stringify(users));
}
document.addEventListener('DOMContentLoaded', ()=>  {
  document.getElementById('btn').addEventListener('click', addUser);

});*/
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

// Enables usage of environmental variables
dotenv.config();

// Connect to db
// process.env.MONGO_DB can be replaced with a string if not using dotenv
mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  },
  () => console.log('Connected to MongoDB!')
);

// Initialize app
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;

// Get User model
var User = require('./models/user');

app.post('/submitted', function (req, res) {
    mongoose.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });
    res.send('Data received:\n' + JSON.stringify(req.body));
});

app.get('/view-feedbacks',  function(req, res) {
    mongoose.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
