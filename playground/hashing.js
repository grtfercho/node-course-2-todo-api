const {SHA256} = require('crypto-js');


var message ="Ferchito que estas haciendo??";

var hashedMessage = SHA256(message);

var stringHashedMessage = hashedMessage.toString();

console.log(`original message : ${message}` );
console.log(`Hashed message : ${hashedMessage}` );
console.log(`StringHashed message : ${stringHashedMessage}` );
