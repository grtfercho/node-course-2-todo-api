const { MongoClient:dbClient, ObjectID:IDGenerator } = require('mongodb');

console.log('=========================================================');
dbClient.connect('mongodb://localhost:27017/SomeOtherDB'
        ,{useNewUrlParser: true}
        ,(err, client) => {
            if(err){
                return console.log('Unable to connect to the DB');
            }
            var db = client.db('TodoApp');
            var allDocs = db.collection("Users")
                                .find({name:'Fernando Lopez'})
                                .toArray()
                                .then((documents) => {
                                    console.table(JSON.stringify(documents,undefined,2));
                                },(err) => {
                                    console.log('There was an error retrieving the docs');
                                 		});
            // var allDocs = db.collection("Todos")
            //                     .find({_id:new IDGenerator('5b993ca34d72c403b1448585')})
            //                     .toArray()
            //                     .then((documents) => {
            //                         console.table(JSON.stringify(documents,undefined,2));
            //                     },(err) => {
            //                         console.log('There was an error retrieving the docs');
            //                      		});
            console.log('Successfully connected to MongoDB, let\'s party. ');

            client.close();
});

console.log(IDGenerator);
