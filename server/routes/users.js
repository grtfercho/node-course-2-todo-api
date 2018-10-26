/*
All these routes work for "/users/"
*/
const {
    User
} = require( './../models/user.js' );
const {
    ObjectId
} = require( 'mongodb' );
const express = require( 'express' );
const _ = require( 'lodash' );
const auth = require('./../middleware/auth.js');
const router = express.Router();


router.post( '/', ( req, res ) => {
    console.log( req.body );

    let body = _.pick( req.body, [ 'email', 'password' ] ); // This can be considered a Marshaller. we only pick what we need from the payload

    var user = new User( body );

    user.save()
        .then( ( dbUser ) => {
            console.log( '============ Saved the new User ============\n', dbUser );
            return dbUser.generateAuthToken(); //with all the values present then generate the webToken
        })
        .then( (token) => {
            // console.log( '============ WebToken ============\n', token );
         	res.header('x-auth-token',token).send(user.toJSONPublic());
        })
        .catch( ( errorOnTheCatch ) => {
            console.log( errorOnTheCatch );
            res.send( `Error, couldn\'t save the to do : ${errorOnTheCatch.message}` );
            console.trace();
        } );

} );

router.get( '/me', auth, ( req, res ) => {
    
    res.send(_.pick(req.user,['_id','email']) );
} );


router.get( '/', ( req, res ) => {
    User.find()
        .then( ( users ) => {
            return res.send( {
                users
            } );
        }, ( err ) => {
            console.log( err );
            return res.status( 400 ).send( err );
        } )
} );

router.get( '/:id', ( req, res ) => {
    if ( !ObjectId.isValid( req.params.id ) ) {
        return res.status( 404 ).send( 'Not a valid ID' );
    }

    User.findById( req.params.id )
        .then( ( user ) => {
            if ( !user ) {
                return res.status( 404 ).send( 'ID did not match any records' );
            }
            console.log( '===== requested ======' );
            console.log( user );
            res.status( 200 ).send( {
                user
            } );
        }, ( err ) => {
            return res.status( 400 ).send( 'Invalid ID' );
        } )
} );

router.delete( '/:id', ( req, res ) => {
    if ( !ObjectId.isValid( req.params.id ) ) {
        return res.status( 404 ).send( 'Not a valid ID' );
    }

    User.findByIdAndDelete( req.params.id )
        .then( ( user ) => {
            if ( !user ) {
                return res.status( 404 ).send( 'ID did not match any records' );
            }
            console.log( '===== requested ======' );
            console.log( user );
            res.status( 200 ).send( {
                user
            } );
        }, ( err ) => {
            return res.status( 400 ).send( 'Invalid ID' );
        } )
} );

router.patch( '/:id', ( req, res ) => {
    if ( !ObjectId.isValid( req.params.id ) ) {
        return res.status( 404 ).send( 'Not a valid ID' );
    }
    let body = _.pick( req.body, [ 'email', 'password' ] ); // This can be considered a Marshaller. we only pick what we need from the payload

    console.log('******** BODY *******');
    console.log(body);


    if ( _.isBoolean( body.completed ) && body.completed ) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt= null;
        body.completed= false;
    }


    User.findByIdAndUpdate( req.params.id, {$set:body},{new:true} )
        .then((user) => {
            if(!user){
                return res.status(404).send('ID doesn\'t exist');
            }
            res.send({user})
         		})
        .catch((error) => {
            res.status(400).send({error:error.message});
         		});
} );

module.exports = router;
