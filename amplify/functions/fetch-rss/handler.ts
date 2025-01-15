// import outputs from "@/../../amplify_outputs.json";
// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { getLastFetchedTime, putArticle, wirteLastFetchedTime } from "../../../src/app/lib/ddb";
import { RssObj } from '../../../src/app/lib/types';
import { fetchRss, parseXml } from "../../../src/app/lib/utils";
// import { Schema } from '../../data/resource';

// Amplify.configure(outputs);
// const client = generateClient<Schema>();

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