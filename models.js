const mongoose = require('mongoose');

const User = mongoose.Schema({
    id: {type: Number, required: true, index: {unique: true}}, 
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    status: {type: String, required: true},
    registrationDate: {type: Date, required: true},
    lastLoginDate: {type: Date, required: true},
});

module.exports =  mongoose.model('User', User)