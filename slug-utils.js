const path = require('path');
const { DATA_DIR } = require('./settings');

exports.slugToPath = function(slug) {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
};
