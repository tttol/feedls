"use client";
import { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateAmplifyClient } from "../lib/client";
import AppVersion from "./AppVersion";
import Article from "./Article";

export default function App() {
  const client = generateAmplifyClient();
  const [articles, setArticles] = useState<Schema["Article"]["type"][]>([]);
  const [siteNames, setSiteNames] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchArticles = async () => {
    const { errors, data } = await client.models.Article.list({});
    if (errors !== undefined || data == null) {
      console.error("error:", errors, "data:", data);
      throw new Error("Failed to get Article.")
    }
    setArticles(data);

    const siteNames = [...new Set(data.map(d => d.siteName))];
    setSiteNames(siteNames);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="bg-orange-400 text-white p-4 text-center font-black text-4xl flex items-center">
        <div className="flex-none" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
        <div className="flex-grow text-center">
          Feedls
        </div>
      </header>
      <AppVersion></AppVersion>
      <div
        className={`absolute left-0 top-12 w-48 bg-white border rounded shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <ul className="p-4 space-y-2">
          {siteNames.map(s => (
            <li key={s}>
              <a href="#" className="block text-gray-800 hover:text-blue-500">{s}</a>
            </li>
          ))}
        </ul>
      </div>
      {articles.map(a => (
        <Article article={a} key={a.id}></Article>
      ))}
    </>
  );
}