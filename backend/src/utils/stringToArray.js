module.exports = function stringToArray(text) {
  return text.split(',').map(x => x.trim());
};