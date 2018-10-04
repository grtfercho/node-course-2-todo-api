//===== Application Settings
require('./config/config.js');
const port = process.env.PORT ;

//===== Primary Modules
const { ObjectId } = require( 'mongodb' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const { mongoose } = require( './db/mongoose.js' );

//===== Application Models
const { User } = require( './models/user.js' );
const { Todo } = require( './models/todo.js' );

//===== Application Routes
const todos = require( './routes/todos.js' );

//=============================================

var app = express();

app.use( bodyParser.json() );
app.use( '/todos', todos ); //=====  CRUD routes defined for "Todos"

app.get( '/', ( req, res ) => {
res.send( 'All seems OK' );
} );


app.listen( port, () => {
console.log( `Server running on port ${port}` );
} );


module.exports.app = app;
