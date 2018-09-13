const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const {
    mongoose
} = require( './db/mongoose.js' );
const {
    User
} = require( './models/user.js' );
const {
    Todo
} = require( './models/todo.js' );



const port = process.env.PORT || 3000;

var app = express();

app.use( bodyParser.json() );
app.post( '/todos', ( req, res ) => {
    console.log( req.body );
    var todo = new Todo( {
        text: req.body.text
    } );

    todo.save().then( ( dbTodo ) => {
            res.send( `Saved new Todo: ${JSON.stringify(dbTodo,undefined,2)}` );

            console.log( 'Saved the new Todo ', dbTodo );

        }, ( err ) => {
            res
                .status( 400 )
                .send( `Error, couldn\'t save the to do, oh the horror. : ${JSON.stringify(err,undefined,2)}` )
        } )
        .catch( ( errorOnTheCatch ) => {
            res.send( `Error, couldn\'t save the to do : ${errorOnTheCatch}` )
        } );

} );

app.listen( port, () => {
    console.log( `Server running on port ${port}` );
} );
