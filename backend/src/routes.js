const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');


const routes = Router();
routes.get('/', (_, res) => res.send('OK'));

//Devs
routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.put('/devs/:github_username', DevController.update);
routes.delete('/devs/:github_username', DevController.destroy);

//Search
routes.get('/search', SearchController.index);

module.exports = routes;