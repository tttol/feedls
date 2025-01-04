import outputs from "@/../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { Item, RssObj } from '../../../src/app/lib/types';
import { Schema } from '../../data/resource';
import { fetchRss, generateDataUnit, parseXml } from "./utils";

// const client = generateAmplifyClient();
Amplify.configure(outputs);
const client = generateClient<Schema>();

export const handler: Handler = async (event: any, context: any) => {
  console.debug("event:", event, "context", context);
  const urls = ["https://konifar-zatsu.hatenadiary.jp/rss"];
  const currentTimeStr: string = new Date().toISOString();
  const lastFetchedTime: Date = await getLastFetchedTime();
  console.debug("lastFetchedTime:", lastFetchedTime);

  for (const u of urls) {
    const responseXml: string = await fetchRss(u);
    const rss: RssObj = parseXml(responseXml);

    putArticles(rss, currentTimeStr, lastFetchedTime);
  }

  wirteLastFetchedTime();
  return "ok";
};

const getLastFetchedTime: () => Promise<Date> = async () => {
  const { errors, data } = await client.models.FetchedHistory.get({ id: "1" });

  if (errors !== undefined || data == null) {
    console.error("error:", errors, "data:", data);
    throw new Error("Failed to get FetchedHistory.")
  }
  console.debug("FetchedHistory:", data);
  return new Date(data.createdAt);
}

const wirteLastFetchedTime = () => {
  client.models.FetchedHistory.update({
    id: "1"
  });
}

const putArticles = (rssObj: RssObj, currentTimeStr: string, lastFetchedTime: Date) => {
  const items: Item[] = rssObj.rss.channel.item;
  let index = 0;
  while (index < items.length) {
    const target = generateDataUnit(items, currentTimeStr, lastFetchedTime, index, rssObj.rss.channel.title);
    // batchPutItem(target);
    // client.mutations.batchPutItemToArticles(target);
    index += target.length;
  }
}