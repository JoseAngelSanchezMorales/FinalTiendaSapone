const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userSchema');

const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: 'saponestore',
	api_key: '237118276894549',
	api_secret: 'LR_tBJ8m-Ht4j5RO95Dek4K8lFA'
})

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {
	const user = await User.findOne({ 'email': email })
	if (user) {
		return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
	} else {
		const newUser = new User();
		newUser.email = email;
		newUser.password = newUser.generateHash(password);
		newUser.name = req.body.name;
		newUser.lstname = req.body.lstname;
		

		await newUser.save();
		done(null, newUser);
	}
}));

passport.use('local-signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {
	const user = await User.findOne({ email: email });
	if (!user) {
		return done(null, false, req.flash('signinMessage', 'No User Found'));
	}
	if (!user.validPassword(password)) {
		return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
	}
	return done(null, user);
}));
