'use strict'

module.exports = function (_, passport, User, validator) {

  return {
    SetRouting: function (router) {
      router.get('/', this.indexPage);
      router.get('/signup', this.getSignUp)
      router.get('/home', this.homePage)


      // router.post('/signup', User.SignUpValidation, this.postSignup)
      router.post('/signup', [
        validator.check('username').not().isEmpty().isLength({min:5})
        .withMessage('Username is required and must be at least 5 characters'),
        validator.check('email').not().isEmpty().isEmail()
        .withMessage('Email is invalid'),
        validator.check('password').not().isEmpty().isLength({min:5})
        .withMessage('Password is required and must be at least 5 characters')
      ], this.postValidation ,this.postSignup)

      // router.post('/signup', User.SignUpValidation, this.postSignup)
      router.post('/signin', [
        validator.check('email').not().isEmpty().isEmail()
        .withMessage('Email is invalid'),
        validator.check('password').not().isEmpty().isLength({min:5})
        .withMessage('Password is required and must be at least 5 characters')
      ], this.postSignin)

    },

    indexPage: function (req, res) {
      return res.render('index')
    },

    getSignUp: function (req, res) {
      const errors = req.flash('error')
      return res.render('signup', {
        title: 'Football | Login',
        messages: errors,
        hasErrors: errors.length > 0
      })
    },

    postValidation: function (req,res,next) {
      const err = validator.validationResult(req)
      const errors = err.array()
        const messages = []
        errors.forEach(error => {
          messages.push(error.msg)
        });

        if(messages.length > 0) {
          req.flash('error', messages)
          if(req.url === '/signup'){
            res.redirect('/signup')
          } else if (req.url === '/'){
            res.redirect('/')
          }
        }
        return next()
    },

    postSignup: passport.authenticate('local.signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    }),

    postSignin: passport.authenticate('local.signup', {
      successRedirect: '/home',
      failureRedirect: '/signin',
      failureFlash: true
    }),

    homePage: function (req, res) {
      return res.render('home')
    },

  }

}