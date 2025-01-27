import dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import path from "path";
import { indexRoute } from "./lib/routes";

// const { indexRoute } = routes;

// const { favicon } = require("./lib/plugins/");

dotenv.config();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});

const server = new Hapi.Server({
  port: process.env.PORT || 8888,
});

const provision = async () => {
  // Add the route
  await server.register(Inert);

  // server.route([indexRoute, files, podcast, podcastShort]);
  server.route([indexRoute]);

  // Start the server
  try {
    await server.register([
      {
        plugin: Inert,
      },
    ]);
    await server
      .start()
      .then(() => console.log("Server running:", server.info));
  } catch (err) {
    console.log(err);
  }
};

provision();
