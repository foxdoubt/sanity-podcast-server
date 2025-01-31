import dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";

import { indexRoute, podcastRoute } from "./lib/routes/routes";
import config from "./lib/app-config";

dotenv.config();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

const server = new Hapi.Server({
  port: config.port,
  tls: true,
});

const provision = async () => {
  server.route([indexRoute, podcastRoute]);

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
