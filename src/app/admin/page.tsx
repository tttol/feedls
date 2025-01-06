"use client"
import { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import AppVersion from "../components/AppVersion";
import Header from "../components/Header";
import { generateAmplifyClient } from "../lib/client";
import ReadgingList from "./components/ReadingList";

export default function Admin() {
  const client = generateAmplifyClient();
  const [readingList, setReadingList] = useState<Schema["ReadingList"]["type"][]>([]);
  const fetchReadingList = async () => {
    const { errors, data } = await client.models.ReadingList.list({
      limit: 1000,
    })
    if (errors !== undefined || data == null) {
      console.error("error:", errors, "data:", data);
      throw new Error("Failed to get ReadingList.");
    }

    console.debug(data);
    setReadingList(data);
  }

  useEffect(() => {
    fetchReadingList();
  }, []);

  return (
    <>
      <Header hasHamburger={false}></Header>
      <AppVersion></AppVersion>
      <ReadgingList readingList={readingList}></ReadgingList>
    </>
  );
}
