const { Router } = require('express');
const router = Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
  })
);

router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/login');
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get('/logout', (req, res) => {
  req.logOut(() => {
    res.redirect('/signin');
  });
});

module.exports = router;
