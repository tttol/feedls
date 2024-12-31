import { XMLParser } from 'fast-xml-parser';
import { Rss } from '../../../src/app/lib/types';
import { Schema } from '../../data/resource';

export const handler: Schema["fetchRss"]["functionHandler"] = async (event, context) => {
  const urls = ["https://aws.amazon.com/about-aws/whats-new/recent/feed/"];
  const ret = [];
  for (const u of urls) {
    const responseXml = await fetchRss(u);
    const obj = parseXml(responseXml);
    console.debug("obj:", obj);
    ret.push(obj);
  }

  return ret.join(",");
};

const fetchRss: any = async (url: string) => {
  console.debug("Request URL:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch error. HTTP status: ${response.status}`);
  }

  const responseText: string = await response.text();
  console.debug("responseText:" ,responseText);
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