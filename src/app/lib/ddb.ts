// import outputs from "@/../../amplify_outputs.json";
// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
// import { Schema } from "../../../amplify/data/resource";

import { generateAmplifyClient } from "./client";
import { Item, RssObj } from "./types";
import { generateDataUnit } from "./utils";

// Amplify.configure(outputs);
// const client = generateClient<Schema>();

const client = generateAmplifyClient();

export const getLastFetchedTime: () => Promise<Date> = async () => {
  const { errors, data } = await client.models.FetchedHistory.get({ id: "1" });

  if (errors !== undefined || data == null) {
    console.error("error:", errors, "data:", data);
    throw new Error("Failed to get FetchedHistory.")
  }
  console.debug("FetchedHistory:", data);
  return new Date(data.fetchedAt);
}

export const wirteLastFetchedTime = async () => {
  await client.models.FetchedHistory.update({
    id: "1",
    fetchedAt: new Date().toISOString(),
  });
}

export const putArticle = async(rssObj: RssObj, currentTime: Date, lastFetchedTime: Date) => {
  const siteName = rssObj.rss.channel.title;
  let insertedArticleCnt = 0;
  for (const item of rssObj.rss.channel.item) {
    if (new Date(item.pubDate) <= lastFetchedTime) continue;

    try {
      await client.models.Article.create({
        siteName: siteName,
        title: item.title,
        link: item.link,
        enclosureUrl: item.enclosure["@_url"],
        enclosureType: item.enclosure["@_type"],
        aiSummary: "",
        isRead: false,
        isDeleted: false,
        publishedAt: item.pubDate,
        fetchedAt: currentTime.toISOString(),
      });
      insertedArticleCnt++;
    } catch (e) {
      console.error("Failed to put article.", item, e);
      continue;
    }
  }

  return insertedArticleCnt;
}

export const batchPutArticles = (rssObj: RssObj, currentTimeStr: string, lastFetchedTime: Date) => {
  const items: Item[] = rssObj.rss.channel.item;
  let index = 0;
  while (index < items.length) {
    const target = generateDataUnit(items, currentTimeStr, lastFetchedTime, index, rssObj.rss.channel.title);
    // batchPutItem(target);
    // client.mutations.batchPutItemToArticles(target);
    index += target.length;
  }
}