const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// console.log that server is up and running
app.listen(process.env.PORT || 8080, () => console.log('istening on port ${process.env.PORT || 8080}!'));

// create a GET route
app.get('/', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS CONNECTED TO REACT' });
});
