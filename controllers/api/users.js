var express = require('express')
var router = express.Router()
var jwt = require('jwt-simple')
var User = require('../../models/user')
var bcrypt = require('bcrypt')
var config = require('../../config')
var sanitize = require('mongo-sanitize');

router.post('/api/users', function(req, res, next) {
    if (req.body.username && req.body.password) {
        var username = sanitize(req.body.username)
        var password = sanitize(req.body.password)

        var user = new User({
            username: username
        })
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return next(err)
            }
            if (user) {
                res.sendStatus(409)
            } else {
                createUser()
            }
        })
    } else {
        console.log("pusto");
    }
    function createUser() {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                return next(err)
            }
            user.password = hash
            user.save(function(err) {
                if (err) {
                    return next(err)
                }
                res.sendStatus(201)
            })
        })
    }

})

router.get('/api/users', function(req, res, next) {
    if (!req.headers['x-auth']) {
        console.log("5");
        return res.sendStatus(401)
    }
    var auth = jwt.decode(req.headers['x-auth'], config.secret)
    User.findOne({
        username: auth.username
    }, function(err, user) {
        if (err) {
            return next(err)
        }
        res.json(user)
    })
})

module.exports = router
