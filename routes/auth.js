// const authController = require('../controllers/auth');
// const express = require('express');
// const path = require('path');

// const router = express.Router();

// router.get('/Login', authController.getAuth);

// router.post('/Login', authController.postAuth);

// router.post('/LogOUT', authController.postLogout);

// module.exports = router;
const express = require('express');

const authController = require('../controllers/auth');

const User = require('../models/user');

const { check, body } = require('express-validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signIn', authController.getSignIn);

router.post(
    '/signIn',
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        }),
      body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
      )
        .isLength({ min: 5 })
        .isAlphanumeric()
    ],
    authController.postSignIn
  );

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/newPass/:id', authController.getNewPass);

router.post('/newPass', authController.postNewPass);

router.post('/LogOUT', authController.postLogout);

module.exports = router;
