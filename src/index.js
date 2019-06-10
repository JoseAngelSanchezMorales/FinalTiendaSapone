const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

require('./conectionDB');
require('./passport/local-auth');
require('dotenv').config();

//app.use(multer({storage}).single('image'));

// Settings and Middleweres
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.set('port', process.env.PORT || 3000)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

// Passport Sesions
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});


// Define routes 
app.use(require('./routes/usersRoutes'))
app.use(require('./routes/profileRoutes'))
app.use(require('../src/routes/adminRoutes'))

// Servidor
app.listen(3000, (err) => {
    err ? console.log(err) : console.log('servidor escuchando puerto 3000')
});
