const podcastRSS = require("../handlers/podcast-rss");
module.exports = {
  method: "GET",
  path: "/rss",
  options: {
    handler: async (request, h) => podcastRSS(request, h),
  },
};
