import { Context, Config } from "@netlify/functions";
import getRssFeed from "../lib/handlers/podcast-rss";
import { createClient } from "@sanity/client";
import appConfig from "../lib/app-config";

export default async (req: Request, context: Context) => {
  const sanityClient = createClient({
    projectId: appConfig.projectId,
    dataset: appConfig.dataset,
    useCdn: true,
    apiVersion: appConfig.currentAPIVersion,
  });
  const url = new URL(req.url);
  const podcast = url.pathname.split("/")[2];

  const isValidPodcast = /^[a-zA-Z0-9_-]+$/.test(podcast);

  if (!isValidPodcast) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const feed = await getRssFeed(podcast, sanityClient);
  return new Response(feed, {
    headers: { "content-type": "application/xml" },
  });
};

export const config: Config = {
  path: "/rss/:podcast",
};
