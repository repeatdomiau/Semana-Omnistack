const Dev = require('../models/Dev');
const stringToArray = require('../utils/stringToArray');

module.exports = {

  async index(request, response) {

    const { latitude, longitude, techs } = request.query;
    const techsArray = stringToArray(techs);

    const devs = await Dev.find({
      techs: { $in: techsArray },
      location: {
        $near: {
          $geometry: {
            type: 'Point', 
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10 * 1000
        }
      }
    });

    return response.json(devs);
  }

};