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
                                .findOneAndUpdate(
                                    { _id : new IDGenerator('5b9966f41d725631313885c9')}
                                    ,{
                                         $set:{ //use this update operator to set a new value
                                            name: "Godzillaa"
                                        },

                                        $inc:{
                                                age:1
                                        }
                                        // { $inc: { quantity: -2, "metrics.orders": 1 } }
                                    },
                                    {//by default findOneAndUpdate returns the original record, we want the modified one.
                                        returnOriginal:false
                                    }
                                )
                                .then((result) => {
                                    console.table(JSON.stringify(result,undefined,2));
                                },(err) => {
                                    console.log('There was an error updating the doc',err);
                                 		});
            // var allDocs = db.collection("Todos")
            //                     .findOneAndUpdate({_id:new IDGenerator('5b993f406aedd503e54623dc')},
            //                     {
            //                         $set:{ //use this update operator to set a new value
            //                             completed:true
            //                         }
            //                     }//,
            //                     // {//by default findOneAndUpdate returns the original record, we want the modified one.
            //                     //     returnOriginal:true
            //                     // }
            //                     )
            //                     .then((result) => {
            //                         console.table(JSON.stringify(result,undefined,2));
            //                     },(err) => {
            //                         console.log('There was an error updating the doc');
            //                      		});


            console.log('Successfully connected to MongoDB, let\'s party. ');

            client.close();
});

console.log(IDGenerator);
