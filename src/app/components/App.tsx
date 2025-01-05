"use client";
import { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateAmplifyClient } from "../lib/client";
import Article from "./Article";

export default function App() {
  const client = generateAmplifyClient();
  const [articles, setArticles] = useState<Schema["Article"]["type"][]>([]);

  const fetchArticles = async () => {
    const { errors, data } = await client.models.Article.list({});
    if (errors !== undefined || data == null) {
      console.error("error:", errors, "data:", data);
      throw new Error("Failed to get Article.")
    }
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <>
      {articles.map(a => (
        <Article article={a} key={a.id}></Article>
      ))}
    </>
  );
}