import { Handler } from "@netlify/functions";
import getRssFeed from "../lib/handlers/podcast-rss";
import { createClient } from "@sanity/client";
import config from "../lib/app-config";

const handler: Handler = async (event, context) => {
  const sanityClient = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    useCdn: true,
    apiVersion: config.currentAPIVersion,
  });

  return {
    statusCode: 200,
    body: await getRssFeed(event, sanityClient),
    headers: {
      "content-type": "application/xml",
    },
  };
};

export { handler };
