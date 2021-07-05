const express = require('express');
// routes
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var managementRouter = require('./routes/management');

const app = express();
// Used to create some test data
const db = require("./models");

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
app.listen(port, () => console.log(`Listening on port ${port}!`));

// fix cors error
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,DELETE, POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// Routes
app.use('/api/auth/', authRouter);
app.use('/api/manage/', managementRouter);

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