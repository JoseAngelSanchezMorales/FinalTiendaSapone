const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/userSchema');
const product = require('../models/productSchema');

const compra = new Schema({
    user: {
        type : Schema.Types.ObjectId,
        ref  : 'User'  
    },
    fecha: {
        type : Date,
        default: Date('"<YYYY-mm-dd>"')
    },
    total: Number,
    productos: [{
        type : Schema.Types.ObjectId,
        ref  : 'product'      
    }],
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('compra', compra);