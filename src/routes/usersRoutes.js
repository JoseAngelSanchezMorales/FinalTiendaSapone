const router = require('express').Router();
const passport = require('passport');


router.get('/', (req, res, next) => {
    res.render('users/index',{
        page_title: 'Home'
    })
});

// Ruta formulario registro
router.get('/signup', (req, res, next) => {
    res.render('users/formSignup', {
        page_title: 'Sign up',
        path : '/signup'
    })
});

// Ruta formulario Inicio sesion
router.get('/signin', (req, res, next) => {
    res.render('users/formSignin', {
        page_title: 'Sign in'
    })
});

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('users/profile/profile', {
        page_title: `${req.user.name} Profile `
    })
});

// Ruta autenticar registro ususario
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

// Ruta Autenticar inicio sesion ususario
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  }));

// Cerrar sesion
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/')
})

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
}

module.exports = router;