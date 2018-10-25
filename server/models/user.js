const mongoose = require('mongoose');
const validator =  require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        unique : true,
        validate:{
            validator: (value) => {
                //validate for the email format.
                return validator.isEmail(value);
            },
            message:'{VALUE} is not a valid email.'
        }
    },
    password:{
        type: String,
        required : true,
        minLength : 6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.toJSONPublic =  function (){
    var user=this;
    console.log(user.email);
    console.log(user.toJSON());
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);

};

userSchema.methods.generateAuthToken =  function (){
        var user = this;
        // console.log('========EMAIL =========\n',user.email);
        var access = 'auth';
        var valueToSign = {
                _id: user._id.toHexString(),
                access
            };
        console.log('Value to sign: ', valueToSign);

        var token = jwt.sign(valueToSign,'saltandpeppa123').toString();
        console.log(token);
        // user.tokens.push({access, token});
        //#8:29 there's a weird issue with some MongoDB versions that dont allow the "Push" method to work properly
        // use the syntax below instead.
        user.tokens = user.tokens.concat([{access,token}]);
        console.log('=============== User tokens =================');
        console.log(user.tokens);

        return user.save()
                    .then(() => {
                        return token ;// once the save is complete return a "token" for the "save"
                    });



};


var User = mongoose.model('User', userSchema);

module.exports = {
    User : User
};
