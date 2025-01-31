import path from "path";
import { ServerRoute } from "@hapi/hapi";
import podcastRSS from "../handlers/podcast-rss";

export const indexRoute: ServerRoute = {
  method: "GET",
  path: "/",
  options: {
    handler: (request, h) => {
      return h.file(path.join(process.cwd(), "static", "index.html"));
    },
  },
};

export const podcastRoute: ServerRoute = {
  method: "GET",
  path: "/{slug}/rss",
  options: {
    handler: async (request, h) => podcastRSS(request, h),
  },
};
