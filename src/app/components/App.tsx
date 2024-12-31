"use client";
import { useEffect, useState } from "react";
import { generateAmplifyClient } from "../lib/client";
import { Rss } from "../lib/types";

export default function App() {
  const client = generateAmplifyClient();
  const [rss, setRss] = useState<string>();

  const fetch = async () => {
    const response = await client.queries.fetchRss({ name: "test function" }) ;
    return response;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch();
      setRss(JSON.stringify(data)); 
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Hello Feedls</h1>
      <p>fetchRss: {rss}</p> 
    </>
  );
}