import { util } from "@aws-appsync/utils";
import { XMLParser } from "fast-xml-parser";
import { Item, RssObj } from "../../../src/app/lib/types";

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

export const parseXml = (xml: string): RssObj => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true, // ignore `<?xml version="1.0" encoding="UTF-8" standalone="no"?>` in top of xml file
  });

  const obj = parser.parse(xml);

  if (!obj || typeof obj !== "object") {
    console.error("Error parsing XML");
    throw new Error("Failed to parse XML string.");
  }

  return obj as RssObj;
  // const rootKey = Object.keys(obj)[0];
  // const root = obj[rootKey];

  // const result: { [key: string]: any } = {};
  // result[rootKey] = root;
  // console.debug("result:", JSON.stringify(result));
  // return result as Rss;
};


export const generateDataUnit = (items: Item[], currentTimeStr: string, lastFetchedTime: Date, index: number, siteName: string) => { 
  const target = [];
  for (let i = 0; i < 25; i++) {// limit of BatchWriteItem is 25
    if (index + i > items.length - 1) break;

    const t = items[index + i];
    if (new Date(t.pubDate) <= lastFetchedTime) continue;

    target.push(util.dynamodb.toMapValues({
      siteName: siteName,
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