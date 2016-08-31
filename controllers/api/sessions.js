var express = require('express')
var router = express.Router()
var jwt = require('jwt-simple')
var _ = require('lodash')
var bcrypt = require('bcrypt')
var User = require('../../models/user')
var config = require('../../config')
var invalidAttempts = 0;
var sanitize = require('mongo-sanitize');

function findUserByUsername(username) {
    return _.find(users, {
        username: username
    })
}


router.post('/api/sessions', function(req, res, next) {
    setTimeout(function(err, user) {
        User.findOne({
                username: sanitize(req.body.username)
            })
            .select('password').select('username')
            .exec(function(err, user) {
                //console.log("XD: " + invalidAttempts);

                if (err) {
                    return next(err)
                }
                if (!user) {
                    invalidAttempts++;
                    return res.sendStatus(401)
                }
                if (user) {
                    bcrypt.compare(sanitize(req.body.password), user.password, function(err, valid) {
                        if (err) {
                            return next(err)
                        }
                        if (!valid) {
                            invalidAttempts++;
                            return res.sendStatus(401)
                        }
                        if (valid) {
                            invalidAttempts = 0;
                            var token = jwt.encode({
                                username: user.username
                            }, config.secret)
                            res.json(token)
                        }
                    })
                }
            })
    }, invalidAttempts*1000)
})

module.exports = router
