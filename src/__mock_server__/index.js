const lib = require('./loadlib.json');

const proxy = {
  'POST /command/moode.php': (req, res) => {
    const { cmd } = req.query;
    switch (cmd) {
      case 'loadlib':
        return res.json(lib);

      case 'clrplayall':
        return res.status(200).end();

      default:
        return res.status(404).end();
    }
  },

  'GET /engine-mpd.php': () => {
    // hold conenction open
  },
};

module.exports = proxy;
