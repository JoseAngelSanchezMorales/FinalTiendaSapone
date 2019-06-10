const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = require('./userSchema');

const card = new Schema({
    user:{
        type : Schema.Types.ObjectId,
        ref  : 'user' 
    },
    numero:Number,
    fechaCaducidad:Date,
    numeroSeguridad:Number,
    nombre:String,
});

module.exports = mongoose.model('card', card);