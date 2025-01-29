const podcastRSS = require("../handlers/podcast-rss");

module.exports = {
  method: "GET",
  path: "/{projectId}/{dataset}/{slug}/rss",
  options: {
    handler: async (request, h) => podcastRSS(request, h),
  },
};
