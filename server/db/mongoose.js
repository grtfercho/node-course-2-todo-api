var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //This way mongoose uses the regular Promise behaviour

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
});
// process.env.MONGODB_URI looks similar to the following.
// setting created from command prompt using heroku
/// > heroku config:set MONGODB_URI=<connection_string>
// mongodb://<dbuser>:<dbpassword>@ds163822.mlab.com:63822/node-todo-api-bluff-db
module.exports = {
    mongoose
}
