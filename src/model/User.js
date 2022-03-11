const mongoose			= require('mongoose');
const Schema            = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, default: true},
    mail: {type: String, default: true},
    bDate: {type: Date, default: true},
    user: {type: String, default: true},
    password: String,
    description: {type: String, default: true}
    
})

const User = mongoose.model('User',userSchema);