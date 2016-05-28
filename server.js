//52.38.65.142:3001


//////////////////////////Modules
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});  // set default to main
var bodyParser = require('body-parser');    // set body parser
var request = require('request');
var moment = require('moment');
var app = express();


////////////////////////////Middlewares

app.use(bodyParser.urlencoded({ extended: false }));  // parser for urlencoded
app.use(bodyParser.json()); // parser for json
app.use( express.static( __dirname + '/client' ));
app.engine('handlebars', handlebars.engine);  // set engine
app.set('view engine', 'handlebars');
app.set('port', 3002); // set port 3001


////////////////////////////Routes
require('./server/routes')(app, request, moment);


/////////////////////////////Start the app
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

