var express = require('express')
var router = express.Router()

router.use(express.static(__dirname + '/../assets'))
var path = require('path')
router.get('/', function (req, res) {
    res.sendFile(path.resolve('layouts/posts.html'))//, { root : __dirname})
})

module.exports = router
