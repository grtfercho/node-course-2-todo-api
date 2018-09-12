const dbClient = require('mongodb').MongoClient;
console.log('=========================================================');
console.log('=========================================================');
console.log('=========================================================');
// console.log(JSON.stringify(dbClient,undefined,2));
// console.log(dbClient.connect);
console.log('=========================================================');
dbClient.connect('mongodb://localhost:27017/SomeOtherDB'
        ,{useNewUrlParser: true}
        ,(err, client) => {
            if(err){
                return console.log('Unable to connect to the DB');
            }
            console.log(client);
            var db = client.db('TodoApp');
            db.collection("Users").insertOne(
                                {name:'Fernando Lopez',
                                age:43,
                                location:'Burke'},
                                (err, results) => {
                                    if (err){
                                        return console.log('cant insert new record, something failed.');
                                    }
                                    console.log('Record inserted : ', JSON.stringify(results.ops,undefined,2));
                             		});
            // db.collection("Todos").insertOne(
            //                     {title:'second Todo on Wednesday',
            //                     completed:false},
            //                     (err, results) => {
            //                         if (err){
            //                             return console.log('cant insert new record, something failed.');
            //                         }
            //                         console.log('Record inserted : ', JSON.stringify(results.ops,undefined,2));
            //                  		});
            console.log('Successfully connected to MongoDB, les party. ');
            client.close();
});
