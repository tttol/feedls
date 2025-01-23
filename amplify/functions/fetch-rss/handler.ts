import { env } from '$amplify/env/fetch-rss';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { RssObj } from '../../../src/app/lib/types';
import { fetchRss, parseXml } from "../../../src/app/lib/utils";
import { Schema } from '../../data/resource';

const {resourceConfig, libraryOptions} = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

export const handler: Handler = async (event: any, context: any) => {
  console.debug("event:", event, "context", context);
  const urls = ["https://konifar-zatsu.hatenadiary.jp/rss", "https://blog.jnito.com/rss"];
  const currentTime: Date = new Date();
  const lastFetchedTime: Date = await getLastFetchedTime();
  console.debug("lastFetchedTime:", lastFetchedTime);


  let totalCount = 0;
  for (const u of urls) {
    const responseXml: string = await fetchRss(u);
    const rss: RssObj = parseXml(responseXml);
    const count = await putArticle(rss, currentTime, lastFetchedTime);
    // batchPutArticles(rss, currentTimeStr, lastFetchedTime);
    console.log(`[${count}] articles in [${u}] were inserted.`);
    totalCount += count;
  }

  await wirteLastFetchedTime();
  return `ok. ${totalCount} articles were inserted.`;
};

const getLastFetchedTime = async () => {
  // const res = await queryDdb(FETCHED_HISTORY, "id", "1");
  // const fetchedAt: string = res?.map(item => item.fetchedAt.S)[0] ?? "";

  // return new Date(fetchedAt);

  const { errors, data } = await client.models.FetchedHistory.get({ id: "1" });

  if (errors !== undefined || data == null) {
    console.error("error:", errors, "data:", data);
    throw new Error("Failed to get FetchedHistory.")
  }
  console.debug("FetchedHistory:", data);
  return new Date(data.fetchedAt)  
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