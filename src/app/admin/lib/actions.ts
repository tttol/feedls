'use server'

import { generateAmplifyClient } from "../../lib/client";
import { validateForm } from "./validation";

const client = generateAmplifyClient();
export default function createReading(formData: FormData) {
  validateForm(formData);
  const url = formData.get("rssUrl") as string;
  client.models.ReadingList.create({
    title: "",
    url: url, 
  })
}