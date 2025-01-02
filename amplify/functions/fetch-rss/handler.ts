import outputs from "@/../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { Rss } from '../../../src/app/lib/types';
import { Schema } from '../../data/resource';
import { fetchRss, parseXml } from "./utility";

// const client = generateAmplifyClient();
Amplify.configure(outputs);
const client = generateClient<Schema>();

export const handler: Handler = async (event: any, context: any) => {
  console.debug("event:", event, "context", context);
  const urls = ["https://aws.amazon.com/about-aws/whats-new/recent/feed/"];
  const currentTimeStr: string = new Date().toISOString();
  const lastFetchedTime: Date = await getLastFetchedTime();
  console.debug("lastFetchedTime:", lastFetchedTime);
  
  for (const u of urls) {
    const responseXml: string = await fetchRss(u);
    const rss: Rss = parseXml(responseXml);

    // putArticles(rss, currentTimeStr, lastFetchedTime);
  }

  wirteLastFetchedTime();
  return "ok";
};

const getLastFetchedTime: () => Promise<Date> = async () => {
  const { errors, data: item } = await client.models.FetchedHistory.get({ id: "1" });
  
  if (errors !== undefined || item == null) {
    console.error("error:", errors, "item:", item);
    throw new Error("Failed to get FetchedHistory.")
  }
  
  return new Date(item.createdAt);
}

const wirteLastFetchedTime = () => {
  client.models.FetchedHistory.update({
    id: "1"
  });
}