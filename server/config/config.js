let ENV = process.env.NODE_ENV || "development";
console.log(`Environment set to : ${ENV}`);

switch(ENV){
    case "development":
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    break;
    case "test":
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    break;

}
