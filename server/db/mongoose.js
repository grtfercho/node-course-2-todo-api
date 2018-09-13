var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //This way mongoose uses the regular Promise behaviour
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
});

module.exports = {
    mongoose
}
