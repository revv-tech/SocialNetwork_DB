// Mongo Database Connector
const mongose = require('mongoose');
mongose.connect('mongodb://localhost/socialnetworkdb', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('MongoDB is connected'))
    .catch(err => console.error(err));