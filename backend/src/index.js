require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-87bcq.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
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
    
    const port = parseInt(process.env.PORT) || 3333;

    //eslint-disable-next-line no-console
    app.listen(port, () => console.log('Listening on 3333...'));
  })
  //eslint-disable-next-line no-console
  .catch((error) => console.log(error));