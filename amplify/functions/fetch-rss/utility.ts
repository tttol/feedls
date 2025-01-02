import { util } from "@aws-appsync/utils";
import { XMLParser } from "fast-xml-parser";
import { Item, Rss } from "../../../src/app/lib/types";

export const fetchRss: any = async (url: string) => {
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

const putArticles = (rss: Rss, currentTimeStr: string, lastFetchedTime: Date) => {
  const items: Item[] = rss.channel.item;
  let index = 0;
  while (index < items.length) {
    const target = generateDataUnit(items, currentTimeStr, lastFetchedTime, index);
    batchPutItem(target);
    index += target.length;
  }
}

export const generateDataUnit = (items: Item[], currentTimeStr: string, lastFetchedTime: Date, index: number) => { 
  const target = [];
  for (let i = 0; i < 25; i++) {// limit of BatchWriteItem is 25
    if (index + i > items.length - 1) break;

    const t = items[index + i];
    console.debug(t.pubDate, lastFetchedTime, new Date(t.pubDate) <= lastFetchedTime);
    if (new Date(t.pubDate) <= lastFetchedTime) continue;

    target.push(util.dynamodb.toMapValues({
      title: t.title,
      link: t.link,
      is_read: false,
      is_deleted: false,
      published_at: currentTimeStr,
      fetched_at: currentTimeStr,
    }));
  }
  return target;
}

export const batchPutItem = (target: any) => {
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