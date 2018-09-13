const mongoose = require('mongoose');

var schemaTodo = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 2,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: ''
    }
});



var Todo = mongoose.model('Todo', schemaTodo);


module.exports = {
    Todo
};
