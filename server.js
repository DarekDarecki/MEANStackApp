var express = require('express');
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())

app.get('/api/posts', function (req, res) {
    res.json([
        {
            username: "mietek",
            body: "aaaabbbbccc"
        }
    ])
})
app.listen(3000, function () {
    console.log("Serwer nasłuchuje na porcie 3000");
})
