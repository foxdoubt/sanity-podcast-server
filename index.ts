import dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import { createClient, SanityClient } from "@sanity/client";

import { indexRoute, podcastRoute } from "./lib/routes/routes";
import config from "./lib/app-config";

dotenv.config();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

const server = new Hapi.Server<{ sanityClient: SanityClient }>({
  port: config.port,
});

server.app.sanityClient = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  useCdn: true,
  apiVersion: config.currentAPIVersion,
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
