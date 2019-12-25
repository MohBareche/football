const express = require('express')
const ejs = require('ejs')
const http = require('http')
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
// const { check, validationResult } = require('express-validator')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')


const container = require('./container')



container.resolve(function (users) {

  mongoose.Promise = global.Promise
  mongoose.connect('mongodb://localhost/football', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  })

  const app = SetupExpress()

  function SetupExpress() {
    const app = express()
    const server = http.createServer(app)
    server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

    ConfigureExpress(app)

    // Setup router
    const router = require('express-promise-router')()
    users.SetRouting(router)

    app.use(router)

  }

  function ConfigureExpress(app) {
    require('./passport/passport-local')


    app.use(express.static('public'))
    app.use(cookieParser())
    app.set('view engine', 'ejs')
    app.use(express.json())
    app.use(express.urlencoded({
      extended: true
    }))

    app.use(session({
      secret: 'ThisIsASecretKey',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    }))

    app.use(flash())
    app.use(passport.initialize())
    app.use(passport.session())
  }

})