const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const User = require('../models/user');
const { check , body } = require('express-validator');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  let mess;
  if (message.length > 0) {
    mess = message[0];
  } else {
    mess = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: false,
    errorMess : mess
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  let mess;
  if (message.length > 0) {
    mess = message[0];
  } else {
    mess = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Login',
    isLoggedIn: false,
    errorMess : mess
  });
};

// exports.postLogin = (req, res, next) => {
//   const email = req.body.email ;
//   const password = req.body.password ;
//   User.findOne({email : email})
//   .then(result => {
//     if( !result) {
//     req.flash('error' , 'invalid email');
//     return res.redirect('/login')
//     }
//     else {
//       bcrypt.compare(password , result.password)
//       .then(doMatch => {
//         req.session.isLoggedIn = true;
//         req.session.user = result;
//         req.session.save(err => {
//           if(!err){
//             res.redirect('/');
//           }
//       });
//     }).catch(err => {
//       req.flash('error' , 'invalid email');
//       return res.redirect('/login');
//     });
//   };
// });
// }
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.getSignIn = (req, res, next) => {
  let message = req.flash('error');
  let mess;
  if (message.length > 0) {
    mess = message[0];
  } else {
    mess = null;
  }
  res.render('auth/signIn', {
    path: '/signIn',
    pageTitle: 'SignIn',
    isLoggedIn: false,
    errorMess : mess
  });
};

exports.postSignIn = (req, res, next) => {
  const email = req.body.email ;
  const password = req.body.password ;
  const cpassword = req.body.password2 ;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signIn', {
      path: '/signIn',
      pageTitle: 'SignIn',
      errorMess: errors.array()[0].msg
    });
  }
  User.findOne({email : email})
  .then(result =>{
    if(result ) {
      req.flash('error', 'Email Exist');
      res.redirect('/signIn')
    }
    else{
      return bcrypt.hash(password , 12)
      .then(hashPassword => {
        const user = new User ({
          email : email ,
          password : hashPassword ,
          cart : { items : [] }
        });
        return user.save()
               .then(result =>{
                req.flash('error', 'Email SignIN , Now Please Log In');
                res.redirect('/login');
               });
      });
    }
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};

exports.postReset = (req , res , next) => {
  const email = req.body.email;
  User.findOne({email : email})
  .then(result => {
    if(!result){
      req.flash('error' , 'no email found');
      res.redirect('/signIn');
    }
    else{
      res.redirect(`/newPass/${result._id}`);
    }
  }
  )
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'sagar963seth@gmail.com',
//       pass: 'hcpswbyqahzfssgl'
//     }
//   });
//   var mailOptions = {
//     from: 'sagar963seth@gmail.com',
//     to: 'onlycom149@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//       res.redirect('/login');
//     } else {
//       console.log('Email sent: ' + info.response);
//       console.log("Congo");
//      req.flash('error' , 'Enter Reset Password')
//      res.redirect('/login');
//     }
//   });
// //  main()
// //  .then(result => {
// //   console.log("Congo");
// //    req.flash('error' , 'Enter Reset Password')
// //    res.redirect('/login');
// //   })
// //  .catch(err => {
// //   console.log(err);
// //   res.redirect('/login');
// //  });
}

exports.getNewPass = (req , res , next) => {
  const id = req.params.id;
  res.render('auth/newPass', {
    path: '/signIn',
    pageTitle: 'New Password',
    isLoggedIn: false,
    userId : id
  });
}

exports.postNewPass = (req , res , next) => {
  const id = req.body.userId;
  const pass = req.body.password;
  User.findOne({_id : id})
  .then( result => {
    return bcrypt.hash(pass , 12)
      .then(hashPassword => {
        result.password = hashPassword;
        result.save();
        req.flash('error' , 'Now enter same email and updated Password');
        res.redirect('/login');
      })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}