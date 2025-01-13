"use server"
import { generateAmplifyClient } from "./client";

const client = generateAmplifyClient();
export const markAsRead = async (id: string) => {
  client.models.Article.update({
    id: id,
    isRead: true,
  })
  console.debug("make isRead=true. id:", id);
}

// TODO BatchUpdate?
export const markAllArticlesAsRead = async () => {

}