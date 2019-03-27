const proxy = {
  'GET /test/': (req, res) => res
    .json({
      test: true,
    }),
};

module.exports = proxy;
