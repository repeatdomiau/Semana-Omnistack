const axios = require('axios');
const Dev = require('../models/Dev');
const stringToArray = require('../utils/stringToArray');

module.exports = {

  async index(_, response) {
    const devs = await Dev.find();
    return response.json(devs);
  },

  async store(request, response) {

    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
      const { name = login, avatar_url, bio, login } = apiResponse.data;
      const techsArray = stringToArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

    }

    return response.json(dev);
  },

  async update(request, response) {

    const { github_username } = request.params;
    const { techs, bio, name } = request.body;
    const techsArray = stringToArray(techs);

    const dev = await Dev.findOne({ github_username });

    const oldDev = { techs: dev.techs, bio: dev.bio, name: dev.name };

    dev.techs = techsArray || dev.techs;
    dev.bio = bio;
    dev.name = name || dev.name;
    await dev.save();

    const newDev = { techs: dev.techs, bio: dev.bio, name: dev.name };

    response.json({ old: oldDev, new: newDev });
  },

  async destroy(request, response) {
    const { github_username } = request.params;
    const dev = await Dev.findOne({ github_username });
    if(dev){
      await Dev.deleteOne({_id : dev._id});
      const devs = await Dev.find();
      return response.json(devs);
    }
    else{
      return response.status(404).json({error:`Usuário ${github_username} não encontrado.`});
    }
  }

};