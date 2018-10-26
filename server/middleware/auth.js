const jwt = require('jsonwebtoken');
const {User} = require('./../models/user.js')
// const config = require('config');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).send('No token, no play');
    }
    console.log('The Token : ',token);
    User.findByToken( token )
        .then( ( user ) => {
            if(!user){
                return Promise.reject('No user with that ID');
            }
            req.user = user;
            req.token = token;
            next();
        } )
        .catch((err) => {
            console.log('there was a problem \n',err);
            res.status(401).send(err);
                });
}


module.exports=auth;


// User.findByToken( req.header( 'x-auth-token' ) )
//     .then( ( user ) => {
//         if(!user){
//             return Promise.reject('No user with that ID');
//         }
//         console.log( user );
//         res.send( _.pick(user,['_id','email'] ) );
//     } )
//     .catch((err) => {
//         console.log('there was a problem \n',err);
//         res.status(401).send(err);
//             });
