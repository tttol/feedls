import outputs from "@/../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Handler } from 'aws-cdk-lib/aws-lambda';
import { XMLParser } from 'fast-xml-parser';
import { Item, Rss } from '../../../src/app/lib/types';
import { Schema } from '../../data/resource';
import { util } from "@aws-appsync/utils";

// const client = generateAmplifyClient();
Amplify.configure(outputs);
const client = generateClient<Schema>();

export const handler: Handler = async (event: any, context: any) => {
  console.debug("event:", event, "context", context);
  const urls = ["https://aws.amazon.com/about-aws/whats-new/recent/feed/"];
  const rssList: Rss[] = [];
  for (const u of urls) {
    const responseXml = await fetchRss(u);
    const rss: Rss = parseXml(responseXml);
    rssList.push(rss);
  }

  return rssList;
};

const fetchRss: any = async (url: string) => {
  console.debug("Request URL:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch error. HTTP status: ${response.status}`);
  }

  const responseText: string = await response.text();
  console.debug("responseText:", responseText);
  return responseText;
}

export const parseXml = (xml: string): Rss => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    ignoreDeclaration: true, // ignore `<?xml version="1.0" encoding="UTF-8" standalone="no"?>` in top of xml file
  });

  const obj = parser.parse(xml);

  if (!obj || typeof obj !== "object") {
    console.error("Error parsing XML");
    throw new Error("Failed to parse XML string.");
  }

  const rootKey = Object.keys(obj)[0];
  const root = obj[rootKey];

  const result: { [key: string]: any } = {};
  result[rootKey] = root;
  console.debug("result:", JSON.stringify(result));
  return result as Rss;
};

// 前回実施時間をDynamoDBに記録
// 前回実施時間 < published なデータだけを書き込む？
const putArticles = (rss: Rss, currentTime: string) => {
  const items: Item[] = rss.channel.item;
  let index = 0;
  while (index < items.length) {
    const target = [];

    // TODO:前回実施時間 < publishedのチェック 
    for (let i = 0; i < 25; i++) {
      const t = items[index + i];
      target.push(util.dynamodb.toMapValues({
        title: t.title,
        link: t.link,
        is_read: false,
        is_deleted: false,
        published_at: currentTime,
        fetched_at: currentTime,
      }));
    }

    batchPutItem(target, currentTime);
    index += 24; // limit of BatchWriteItem is 25
  }
}

const batchPutItem = (target: any, currentTime: string) => {
  try {
    return {
      operation: 'BatchPutItem',
      tables: {
        Article: target,
      },
    };
  } catch (e) {
    console.error("Failed to inserting article into DynamoDB.", e);
  }
}