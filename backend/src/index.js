const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-87bcq.gcp.mongodb.net/week10?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    const app = express();
    
    app.use((req, res, next) => {
      //eslint-disable-next-line no-console
      console.log(`Request received for ${req.url} using ${req.method}`);
      next();
    });
    
    app.use(cors());
    app.use(express.json());
    app.use(routes);
    
    //eslint-disable-next-line no-console
    app.listen(3333, () => console.log('Listening on 3333...'));
  })
  //eslint-disable-next-line no-console
  .catch((error) => console.log(error));