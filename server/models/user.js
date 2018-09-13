const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        min: 3,
    }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User : User
};
