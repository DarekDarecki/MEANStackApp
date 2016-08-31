var db = require("../db")
var Schema = db.Schema

var postSchema = new Schema({
    username: {type: String, required: true},
    body: {type: String, required:true},
    date: {type: Date, required:true, default: Date.now},
    dateparsed: {type: String, required: true}//, default: Date.now}
})
postSchema.set('toJSON', {
    virtuals: true
});
var Post = db.model("Post", postSchema)

module.exports = Post
