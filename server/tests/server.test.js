const expect = require( 'expect' );
const request = require( 'supertest' );

const {app} = require( './../server' );
const {Todo} = require( './../models/todo' );

const seedTodos = [
        { text: "Ipsum Lorem for Test 100" },
        { text: "Ipsum Lorem for Test 200" },
        { text: "Ipsum Lorem for Test 300" },
        { text: "Ipsum Lorem for Test 400" }
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
                expect(res.body.length).toBe(seedTodos.length);
                done();
            });

    });
}); //Describe GET /todos
