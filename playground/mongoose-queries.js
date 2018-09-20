const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');

const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');




var id = '5ba3079d36338c2cbabd00ac0';
if(!ObjectId.isValid(id)){
    console.log('The DB ID provided is invalid');
} else{
    console.log('ID checks out, we are good to go.');
}
var text ="Ipsum Lorem for Test 400";

User.findById("5ba3aabc1d7256313138d345")
    .then((user) => {
        if(!user){
            return console.log('No users found');
        }
        console.log("----------List of Users-------");
        console.log(user);
    },(err) => {
        console.log(err);
     		})
    .catch((error) => {
        console.log('Something went wrong, details follow:');
        console.log(error);
     		})


// General query using "find"
// Todo.find({
//         text
//     })
//     .then((todos) => {
//         console.log('===== Query by FIND =======');
//         console.log(todos);
//     })
//     .catch((err) => {
//         console.log(err);
//      		});

//findOne returns only one document as a struct even if multiple are present.
Todo.findOne({
    text
})
.then((todo) => {
    console.log('===== Query by FINDONE =======');
    console.log(todo);
})
.catch((err) => {
    console.log(err);
});

//findByID returns only one document as a struct even if multiple are present.
// Todo.findById(id)
// .then((todo) => {
//     console.log('===== Query by FINDBYID =======');
//     console.log(todo);
// })
// .catch((err) => {
//     console.log(err);
// });
