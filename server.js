var express = require('express');
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

app.use(require('./auth.js'))
app.use(require('./controllers/api/posts.js'))
app.use(require('./controllers/api/users.js'))
app.use(require('./controllers/api/sessions.js'))
app.use(require('./controllers/static.js'))


var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('./ws.key'),
  cert: fs.readFileSync('./ws.crt')
};


// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

//var server = app.listen(3000)

//require('./websockets.js').connect(server);
