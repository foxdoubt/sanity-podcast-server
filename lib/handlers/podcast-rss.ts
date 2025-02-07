import RSS from "rss";
import { SanityClient } from "@sanity/client";
import podcastFeed from "../queries/podcast-feed";
import config from "../app-config";

export default async (podcastName: string, client: SanityClient) => {
  const query = podcastFeed;
  const generator = `Get RSS Function for '${podcastName}'`;

  const data = await client
    .fetch(query, { slug: podcastName })
    .catch((err: any) => console.error(err));

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
    feed_url: podcastName,
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

  return feed.xml();
};
