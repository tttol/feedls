'use server'

import { fetchRss, parseXml } from "@/app/lib/utils";
import { generateAmplifyClient } from "../../lib/client";
import { validateForm } from "./validation";
import { RssObj } from "@/app/lib/types";

const client = generateAmplifyClient();
export default async function createReading(formData: FormData) {
  validateForm(formData);
  const url = formData.get("rssUrl") as string;
  
  const responseXml: string = await fetchRss(url);
  const rss: RssObj = parseXml(responseXml);
  const title: string = rss.rss.channel.title;
  if (!title) {
    throw new Error("Failed to fetch blog title.");
  }

  client.models.ReadingList.create({
    title: title,
    url: url, 
  })
}