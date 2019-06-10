const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = require('./userSchema');

const address = new Schema({
    user:{
        type : Schema.Types.ObjectId,
        ref  : 'user' 
    },
    calle:String,
    colonia:String,
    cp:Number,
    estado:String,
    municipio:String
});

module.exports = mongoose.model('address', address);