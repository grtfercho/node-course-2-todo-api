const expect = require( 'expect' );
const request = require( 'supertest' );
const {ObjectID} = require('mongodb');

const {app} = require( './../server' );
const {Todo} = require( './../models/todo' );

const seedTodos = [
        { _id: new ObjectID(), text: "Ipsum Lorem for Test 100" },
        { _id: new ObjectID(), text: "Ipsum Lorem for Test 200" },
        { _id: new ObjectID(), text: "Ipsum Lorem for Test 300" },
        { _id: new ObjectID(), text: "Ipsum Lorem for Test 400" }
    ];
beforeEach( ( done ) => {
    Todo.deleteMany( {} )
        .then(() => {
            return Todo.insertMany(seedTodos)
         		})
        .then( () => done() );
} );

describe( 'POST /todos', () => {
    it( 'Should save a new todo', ( done ) => {
        var text = "ipsum lorem 2019";
            request( app )
                .post( '/todos' )
                .send( {
                    text
                } )
            .expect( 200 )
            .expect( ( res ) => {
                expect( res.body.text  ).toBe( text )
            } )
            .end( ( err, res ) => {
                if ( err ) {
                    console.log(err);
                    return done( err );
                }

                Todo.find({text})
                    .then( ( todos ) => {
                        expect( todos.length ).toBe( 1 );
                        expect( todos[ 0 ].text ).toBe( text );
                        done();
                    } )
                    .catch( ( err ) => {
                        console.log(err);
                        return done( err );
                    } );
            } );
    } );

    it('should not save a record with no data',( done ) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err){
                return done(err);
            }
            Todo.find()
                .then((todos) => {
                    expect(todos.length).toBe(seedTodos.length);
                    done();
                })
                .catch((err) => {
                     done(err);
                 		});

         		})

     		});

} );


describe('GET /todos',() => {
    it('Should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {

                if(err) {
                    return done(err);
                }
                expect(res.body.todos.length).toBe(seedTodos.length);
                done();
            });

    });
}); //Describe GET /todos

describe('GET /todos/:id individual Ids.',() => {
    it('Should get one Todo',(done) => {
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

    it('Should return a 404 if todo not found with valid ID',(doneFunctionHere) => {

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

    it('Should return a 404 if ID is invalid',(doneFunctionHere) => {

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
