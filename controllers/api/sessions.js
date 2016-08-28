var express = require('express')
var router = express.Router()
var jwt = require('jwt-simple')
var _ = require('lodash')
var bcrypt = require('bcrypt')
var User = require('../../models/user')
var config = require('../../config')


function findUserByUsername(username) {
    return _.find(users, {
        username: username
    })
}


router.post('/api/sessions', function(req, res, next) {
    User.findOne({
            username: req.body.username
        })
        .select('password').select('username')
        .exec(function(err, user) {
            if (err) {
                console.log("1");
                return next(err)
            }
            if (!user) {
                console.log("2");
                return res.sendStatus(401)
            }
            bcrypt.compare(req.body.password, user.password, function (err, valid) {
                if (err) {
                    console.log("3");
                    return next(err)
                }
                if (!valid) {
                    console.log("4");
                    return res.sendStatus(401)
                }
            })
            var token = jwt.encode({
                username: user.username
            }, config.secret)
            res.json(token)
            /*
            var user = findUserByUsername(req.body.username)
            validateUser(user, req.body.password, function (err, valid) {
                if (err || !valid){
                    return res.sendStatus(401)
                }
            })*/
        })
})

module.exports = router
