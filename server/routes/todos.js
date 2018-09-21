/*
All these routes work for "/posts/"
*/
const {Todo} = require( './../models/todo.js' );
const {ObjectId } =require('mongodb');
const express = require( 'express' );
const router = express.Router();


router.post( '/', ( req, res ) => {
    console.log( req.body );
    var todo = new Todo( {
        text: req.body.text
    } );

    todo.save()
        .then( ( dbTodo ) => {
            res.send( {todo:dbTodo} );

        //    console.log( 'Saved the new Todo ', dbTodo );

            },
            ( err ) => {
                // console.log('*************************');
                // console.log(err);
                // console.log('*************************');
                res
                    .status( 400 )
                    .send( `Error, couldn\'t save the to do, oh the horror. : ${JSON.stringify(err,undefined,2)}` )
            })
        .catch( ( errorOnTheCatch ) => {
            console.log(errorOnTheCatch);
            res.send( `Error, couldn\'t save the to do : ${errorOnTheCatch}` )
        } );

} );


router.get('/',(req, res) => {
        Todo.find()
            .then((todos) => {
                return res.send({todos});
            },(err) => {
                console.log(err);
                return res.status(400).send(err);
             		}
            )
 		});

router.get('/:id',(req, res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.status(404).send('Not a valid ID');
    }

        Todo.findById(req.params.id)
            .then((todo) => {
                if(!todo){
                    return res.status(404).send('ID did not match any records');
                }
                console.log('===== requested ======');
                console.log(todo);
             res.status(200).send({todo});
            },(err) => {
                return res.status(400).send('Invalid ID');
             		}
            )
 		});

router.delete('/:id',(req, res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.status(404).send('Not a valid ID');
    }

        Todo.findByIdAndDelete(req.params.id)
            .then((todo) => {
                if(!todo){
                    return res.status(404).send('ID did not match any records');
                }
                console.log('===== requested ======');
                console.log(todo);
             res.status(200).send({todo});
            },(err) => {
                return res.status(400).send('Invalid ID');
             		}
            )
 		});

module.exports = router;
