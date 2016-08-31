var express = require('express')
var router = express.Router()

router.use(express.static(__dirname + '/../assets/'))
router.use(express.static(__dirname + '/../templates'))

var path = require('path')
router.get('/', function (req, res) {
    res.sendFile(path.resolve('layouts/app.html'))//, { root : __dirname})
})
router.get('/*', function(req, res) {
    return res.sendFile(path.resolve('layouts/app.html'));
});

module.exports = router
