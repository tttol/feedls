"use server"
import { generateAmplifyClient } from "./client";

const client = generateAmplifyClient();
export const makeRead = async (id: string) => {
  client.models.Article.update({
    id: id,
    isRead: true,
  })
  console.debug("make isRead=true. id:", id);
}