import RSS from "rss";
import { SanityClient } from "@sanity/client";
import { postFeedGroqQuery, showDescriptionQuery } from "../queries/post-feed";
import config from "../app-config";

export default async (client: SanityClient) => {
  const generator = `Get RSS Function for 'Posts'`;

  const postData = await client
    .fetch(postFeedGroqQuery)
    .catch((err: any) => console.error(err));

  const showData = await client
    .fetch(showDescriptionQuery)
    .catch((err: any) => console.error(err));

  console.log({ postData, showData });
  //   const { title = "", description = "" } = data;

  // set current build date as pubDate for the whole feed:
  // const pubDate = new Date();
  // const ttl = config.TTL || 60;

  // const feed = new RSS({
  //   generator,
  //   title,
  //   description,
  //   pubDate,
  //   ttl,
  //   site_url: config.siteUrl,
  //   feed_url: config.siteUrl + "/post-feed",
  // });
};
