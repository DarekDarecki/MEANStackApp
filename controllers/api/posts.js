var Post = require("../../models/post")
var router = require('express').Router()
var websockets = require('../../websockets');
var sanitize = require('mongo-sanitize');

router.get('/api/posts', function(req, res, next) {
    if (req.headers['x-auth']) {
    Post.find()
        .sort("-date")
        .exec(function(err, posts) {
            if (err) {
                return next(err)
            }
            res.json(posts)
        })
    } else {
        return res.sendStatus(401);
    }
})

router.post("/api/posts", function(req, res, next) {
    if (req.headers['x-auth']) {
        var post = new Post({
            body: sanitize(req.body.body)
        })
        post.dateparsed = req.body.dateparsed
        post.username = req.auth.username
        post.save(function(err, post) {
            if (err) {
                return next(err)
            }
            websockets.broadcast('new_post', post)
            res.status(201).json(post)
        })
    } else {
        return res.sendStatus(401);
    }
})

module.exports = router
