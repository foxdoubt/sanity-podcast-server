import { Context, Config } from "@netlify/functions";
import getPostFeed from "../lib/handlers/get-post-feed";
import { createClient } from "@sanity/client";
import appConfig from "../lib/app-config";

export default async (req: Request, context: Context) => {
  const sanityClient = createClient({
    projectId: appConfig.projectId,
    dataset: appConfig.dataset,
    useCdn: true,
    apiVersion: appConfig.currentAPIVersion,
  });

  const feed = await getPostFeed(sanityClient);

  return new Response("feed", {
    headers: { "content-type": "application/xml" },
  });
};

export const config: Config = {
  path: "/post-feed",
};
