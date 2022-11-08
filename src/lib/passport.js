const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../database');
const { encryptPassword, matchPassword } = require('./helpers');

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log(req.body);
      const rows = await pool.query('SELECT * FROM users WHERE username = ?', [
        username,
      ]);

      const userExist = rows[0];

      if (userExist.length > 0) {
        const user = userExist[0];
        const validPassword = await matchPassword(password, user.password);
        if (validPassword) {
          done(null, user, req.flash('success', 'Welcome' + user.username));
        } else {
          done(null, false, req.flash('message', 'Incorrect Password'));
        }
      } else {
        return done(
          null,
          false,
          req.flash('message', "Username doesn't exist :(")
        );
      }
    }
  )
);

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;

      const uExist = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      const usernameExist = uExist[0];

      console.log(usernameExist);

      const newUser = {
        username,
        password,
        fullname,
      };

      newUser.password = await encryptPassword(password);
      const newPassword = await encryptPassword(password);

      if (usernameExist.length <= 0) {
        const result = await pool.query(
          'INSERT INTO users(username, password, fullname) VALUES(?, ?, ?)',
          [username, newPassword, fullname]
        );
        newUser.id = result[0].insertId;
        return done(null, newUser);
      } else {
        done(null, false, req.flash('message', 'Username already exits :('));
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

  return done(null, rows[0]);
});
