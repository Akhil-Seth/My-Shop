const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const User = require('./models/user');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');


const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI = `mongodb+srv://Akhil:AkhilAkhil@akhil.rlqofnc.mongodb.net/shop`;
console.log(MONGODB_URI);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.basename(file.originalname) );
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const logStream = fs.createWriteStream(path.join(__dirname , 'access.Log') , { flags : 'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: logStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage , fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false  , store: store})
);
const csrfProtection = csrf();

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((error , req , res , next) => {
  console.log(error);
  const statusCd = error.statusCode || 500;
  const mess = error.message;
  res.status(statusCd).json({message : mess});
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isLoggedIn : true
  });
});

mongoose.connect(MONGODB_URI)
.then(result => {
  app.listen(4000) ;
}).catch(err => {
  console.log(err);
})