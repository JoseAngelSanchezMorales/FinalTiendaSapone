const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    date: {
        type : Date,
        default: Date("<YYYY-mm-dd>")
    },
    name_contact: String,
    email_contact: String,
    message: String,
    answered : Boolean
});

module.exports = mongoose.model('message', message);