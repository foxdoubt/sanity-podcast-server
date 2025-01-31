import RSS from "rss";
import { createClient, SanityClient } from "@sanity/client";
import podcastFeed from "../queries/podcast-feed";
import { Request, ReqRefDefaults, ResponseToolkit } from "@hapi/hapi";
import config from "../app-config";

export default async (
  request: Request<ReqRefDefaults>,
  h: ResponseToolkit<ReqRefDefaults>,
  client: SanityClient
) => {
  const {
    params: { slug },
  } = request;

  const query = podcastFeed;
  const generator = `Sanity Podcast Server`;

  const data = await client
    .fetch(query, { slug })
    .catch((err) => console.error(err));

  const {
    title = "",
    description = "",
    copyright = "",
    language = "",
    link = "",
    feedExplicit = "",
    itunesSubtitle = "",
    itunesAuthor = "",
    itunesSummary = "",
    itunesOwner: { itunesName = "", itunesEmail = "" } = {},
    itunesImage = "",
    itunesType = "",
    itunesCategories: {
      primary = "",
      secondary = false,
      tertiary = false,
    } = {},
    episodes = [],
  } = data;

  // set current build date as pubDate for the whole feed:
  const pubDate = new Date();
  const ttl = config.TTL || 60;

  const feed = new RSS({
    generator,
    title,
    description,
    pubDate,
    ttl,
    site_url: link,
    image_url: itunesImage,
    feed_url: slug,
    copyright,
    language,
    categories: [primary, secondary && secondary, tertiary && tertiary],
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
    custom_elements: [
      { "itunes:title": title },
      { "itunes:subtitle": itunesSubtitle },
      { "itunes:author": itunesAuthor },
      { "itunes:summary": itunesSummary || description },
      { "itunes:explicit": feedExplicit ? "yes" : "no" },
      { "itunes:type": itunesType },
      {
        "itunes:owner": [
          { "itunes:name": itunesName },
          { "itunes:email": itunesEmail },
        ],
      },
      {
        "itunes:image": {
          _attr: {
            href: itunesImage,
          },
        },
      },
      {
        "itunes:category": [
          {
            _attr: {
              text: primary,
            },
          },
          secondary
            ? {
                "itunes:category": [
                  {
                    _attr: {
                      text: secondary,
                    },
                  },
                ],
              }
            : "",
          tertiary
            ? {
                "itunes:category": [
                  {
                    _attr: {
                      text: tertiary,
                    },
                  },
                ],
              }
            : "",
        ],
      },
    ],
  });

  episodes.forEach((attrs: any) => {
    const {
      guid,
      title,
      description,
      url,
      date,
      slug,
      itunesImageHref,
      enclosureUrl,
      enclosureLength,
      itunesEpisodeType,
      itunesExplicit,
      itunesDuration,
      itunesSummary,
      itunesFeedSubtitle,
    } = attrs;

    feed.item({
      title,
      guid,
      description,
      url,
      date,
      custom_elements: [
        { slug },
        {
          enclosure: [
            {
              _attr: {
                url: enclosureUrl,
                length: enclosureLength,
                type: itunesEpisodeType,
              },
            },
          ],
        },
        { "itunes:summary": itunesSummary },
        { "itunes:subtitle": itunesFeedSubtitle },
        { "itunes:episodeType": itunesEpisodeType },
        { "itunes:duration": itunesDuration },
        { "itunes:explicit": itunesExplicit ? "yes" : "no" },
        {
          "itunes:image": [
            {
              _attr: {
                href: itunesImageHref,
              },
            },
          ],
        },
      ],
    });
  });
  const response = h.response(feed.xml());
  response.type("application/xml");
  return response;
};
