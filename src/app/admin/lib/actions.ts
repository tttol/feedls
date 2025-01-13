'use server'

import { generateAmplifyClient } from "../../lib/client";
import { validateForm } from "./validation";

const client = generateAmplifyClient();
export async function createReading(formData: FormData) {
  validateForm(formData);
  const url = formData.get("rssUrl") as string;
  const title = formData.get("title") as string;

  client.models.ReadingList.create({
    title: title,
    url: url,
  })
}

export async function deleteReading(targetId: string) {
  client.models.ReadingList.delete({
    id: targetId
  });
}