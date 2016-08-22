var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost/social', function () {
    console.log('Connected');
})
module.exports = mongoose
