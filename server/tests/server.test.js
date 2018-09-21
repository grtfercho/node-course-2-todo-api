const expect = require( 'expect' );
const request = require( 'supertest' );
const {ObjectID} = require('mongodb');

const {app} = require( './../server' );
const {Todo} = require( './../models/todo' );

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
var testToken = '';
var seedTodos =[];

after((done) => {
    Todo.deleteMany( {
            text:{
                $regex: new RegExp("-!.*!-$","i")
            }
        } )
        .then( () => done() )
        .catch((error) => {

            console.log(error);
            done();
        });

});
beforeEach( ( done ) => {
    testToken = uuidv4();
    seedTodos = [
            { _id: new ObjectID(), text: `Ipsum Lorem for Test 100 -!${testToken}!-` },
            { _id: new ObjectID(), text: `Ipsum Lorem for Test 200 -!${testToken}!-` },
            { _id: new ObjectID(), text: `Ipsum Lorem for Test 300 -!${testToken}!-` },
            { _id: new ObjectID(), text: `Ipsum Lorem for Test 400 -!${testToken}!-` },
        ];
    Todo.deleteMany( {
            text:{
                $regex: new RegExp("-!.*!-$","i")
            }
        } )
        .then(() => {
            return Todo.insertMany(seedTodos)
         	})
        .then( () => done() )
        .catch((error) => {
            console.log('=======Before Each Error=============');
            console.log(error);
         		});
} );

describe( '********* POST /todos [ Create a NEW todo ] *********', () => {
    it( '-- Should save a new todo', ( done ) => {
        var text = `ipsum lorem new: -!${uuidv4()}!-`;
        //Check if the result from the POST returns the new record.
        request( app )
            .post( '/todos' )
            .send( {
                text
            } )
        .expect( 200 )
        .expect( ( res ) => {
            expect( res.body.todo.text  ).toBe( text )
        } )
        .end( ( err, res ) => {
            if ( err ) {
                console.log('Error on response for POST /todos: ',err);
                return done( err );
            }
        // Check if the record actually made it to the DB and it has the data we sent.
        Todo.find({text})
            .then( ( todos ) => {
                expect( todos.length ).toBe( 1 );
                expect( todos[ 0 ].text ).toBe( text );
                done();
            } )
            .catch( ( err ) => {
                console.log('Error on DB query for POST /todos: ',err);
                console.log(err);
                return done( err );
            } );
        } );
    } );

    it('-- Should not save a record with no data',( done ) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err){
                console.log('       -- !! Error on the Request ');
                console.log('       -- !!!!!!!!!!!!!!!!!!!!!!!!!');
                return done(err);
            }
            console.log('       -- the token for this test : ', testToken);
            Todo.find( {
                    text: {
                        $regex: new RegExp( testToken, "i" )
                    }
                } )
                .then((todos) => {
                    expect(todos.length).toBe(seedTodos.length);
                    done();
                },(error) => {
                    console.log('       -- !! Error on the Promise ');
                    console.log('       -- !!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.log(error);
                    done(error);
                 		})
                .catch((err) => {
                    console.log('       -- !! Error on the catch ');
                    console.log('       -- !!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.log(err);
                     done(err);
                 		});

         		})

	});

} );


describe('*********  GET /todos *********',() => {
    it('-- Should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                console.log("  --- Total Records on the Response : ",res.body.todos.length);
                Todo.countDocuments((err,totalCount) => {
                    console.log("  --- Total Records on the DB : ", totalCount);
                    expect(res.body.todos.length).toBe(totalCount);
                    done();
                 		});
            });

    });
}); //Describe GET /todos

describe('**************** GET /todos/:id individual Ids.****************',() => {
    it('-- Should get one Todo',(done) => {
        var idx = Math.floor(Math.random() * (seedTodos.length) )
        console.log('Retrieving document # : ', idx);
        request(app)
            .get(`/todos/${seedTodos[idx]._id}`)
            .expect(200)
            .end((err, res) => {

                if(err) {
                    return done(err);
                }
                expect(res.body.todo.text).toBe(seedTodos[idx].text);
                done();
            });

    });

    it('-- Should return a 404 if todo not found with valid ID',(doneFunctionHere) => {

        var IDtest =new ObjectID();
        console.log(JSON.stringify(IDtest,undefined,2));
        console.log('Id to Test: ',IDtest);
        console.log('Hex representation : ',IDtest.toHexString());

            request(app)
                .get(`/todos/${IDtest}`)
                .expect(404)
                .expect((res) => {
                    expect(res.text).toBe('ID did not match any records')
                 		})
                .end((err,res) => {
                    if (err){
                        return doneFunctionHere(err);
                    }
                    console.log('===== Result from test request with valid ID not on DB ===');
                    console.log(res.text);
                    console.log('-------------------------------------');
                    doneFunctionHere();
                 })

     		}
    );

    it('-- Should return a 404 if ID is invalid',(doneFunctionHere) => {

            request(app)
                .get(`/todos/123`)
                .expect(404)
                .expect((res) => {
                    expect(res.text).toBe('Not a valid ID')
                 		})
                .end((err,res) => {
                    if (err){
                        return doneFunctionHere(err);
                    }
                    console.log('===== Result from test request with invalid ID ===');
                    console.log(res.text);
                    console.log('-------------------------------------');
                    doneFunctionHere();
                 })

     		}
    );



}); //Describe GET /todos

describe('******** DELETE /todos:id **********',() => {

        it('-- Should delete the todo identified by ID',(doneFunctionName) => {

            let idxToDelete = Math.floor(Math.random() * (seedTodos.length) );

            let id = seedTodos[idxToDelete]._id;

            request(app)
                .delete(`/todos/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(id);
                 	})
                .end((err,done) => {
                    Todo.findById(id)
                        .then((todo) => {
                            expect(todo).toBeNull();
                            doneFunctionName();
                        },
                        (err) => {
                            console.log('       -- !! Error on the rejection ');
                            console.log('       -- !!!!!!!!!!!!!!!!!!!!!!!!!');
                            console.log(err);
                            doneFunctionName(err);
                         		})
                        .catch((err) => {
                            console.log('       -- !! Error on the catch ');
                            console.log('       -- !!!!!!!!!!!!!!!!!!!!!!!!!');
                            console.log(err);
                            doneFunctionName(err);
                         		})
                 		});

        });
});
