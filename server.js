require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');
const passport = require('passport');
const usersRouter = require('./server/routes/usersRouter');
const index = require("./server/routes/index");
const path = require("path");
// const {router: usersRouter} = require('./users');
// const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
const session = require("express-session");
mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');

const app = express();
app.use(express.static(path.join(__dirname, "/build")));

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(session({
 secret: '945575d5-62f7-41f7-8e16-50e4e52fe725',
 resave: false,
 saveUninitialized: true,
 cookie: {
   secure: false
 }
}));

app.use(passport.initialize());
// passport.use(basicStrategy);
// passport.use(jwtStrategy);

app.use('/api/users', usersRouter);
app.use('/', index);
// app.use('/api/auth/', authRouter);


// A protected endpoint which needs a valid JWT to access it
// app.get('/api/github',(req, res) => {
//   var url = 'https://jobs.github.com/positions.json?description=python&location=new+york';
//
// http.get(url, function(res) {
// var fbResponse = JSON.parse(res)
// console.log("Got response: " + fbResponse.picture);
// }).on('error', function(e) {
// console.log("Got error: " + e.message);
// });
// });

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
