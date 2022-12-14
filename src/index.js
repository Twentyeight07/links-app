const express = require('express');
const morgan = require('morgan');
const {
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
} = require('./config.js');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');

const { database } = require('./config.js');

//initializations
const app = express();
require('./lib/passport.js');

//settings
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js'),
  })
);
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    key: 'eddyloginmysql',
    secret: 'eddymysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  next();
});

//Routes
app.use(require('./routes/'));
app.use(require('./routes/authentication.js'));
app.use('/links', require('./routes/links.js'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting the Server
app.listen(PORT);

console.log(`Server Running on PORT ${PORT}`);
