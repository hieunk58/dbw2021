const express = require('express');
// var bodyParser = require('body-parser')
const dbConfig = require("./config/db.config");
// routes
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');

const app = express();
// Used to create some test data
const db = require("./models");
const Role = db.role;
const User = db.user;

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://hieunk58:123456a@@cluster0.f76yh.mongodb.net/tuc_db?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Successfully connect to MongoDB.");
  // initial();
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});

// app.use(bodyParser.json());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 8080;

// console.log that server is up and running
app.listen(process.env.PORT || 8080, () => console.log('Listening on port ${process.env.PORT || 8080}!'));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// Routes
app.use('/api/auth', authRouter);

// route not found
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
 });
// log errors to console
 app.use(logErrors);
  //
 app.use(clientErrorHandler);
 app.use((error, req, res, next) => {
 res.status(error.status || 500);
   return res.json({
   status:error.status || 500,
   message: error.message,
   error: {
   error: error.message,
   },
 });
});

// log errors to console
function logErrors(err, req, res, next) {
console.error(err.stack);
next(err);
}
// error handling for xhr request
function clientErrorHandler(err, req, res, next) {
if (req.xhr) {
 //console.log('xhr request');
 res.status(400).send({status: 400, message: "Bad request from client", error: err.message });
} else {
 next(err);
}
}
// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       new Role({
//         name: "student"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'student' to roles collection");
//       });

//       new Role({
//         name: "teacher"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'teacher' to roles collection");
//       });

//       new Role({
//         name: "admin"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'admin' to roles collection");
//       });
//     }
//   });
// }
