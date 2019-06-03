const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tiendaSapone', {
    useNewUrlParser: true
})
    .then(db => console.log(`DB conected`))
    .catch(err => console.log(err))