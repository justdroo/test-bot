//
// APP FRAMEWORK
//
const express = require('express')
const app = express()
// For parsing JSON strings
const bodyParser = require('body-parser')
// Simplified HTTP client
const request = require('request')

//
// DATABASE CONNECTION
//
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mydb');

//
//ENVIRONMENT VARIABLES
//
app.set('port', (process.env.PORT || 5000))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
  setGreetingText();
})
