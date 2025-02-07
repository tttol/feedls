"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateAmplifyClient } from "../lib/client";
import AppVersion from "./AppVersion";
import ArticleList from "./ArticleList";
import Header from "./Header";
import Menu from "./Menu";

export default function App() {
  const client = generateAmplifyClient();
  const [articles, setArticles] = useState<Schema["Article"]["type"][]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Schema["Article"]["type"][]>([]);
  const [siteNames, setSiteNames] = useState<string[]>([]);
  const [selectedSiteName, setSelectedSiteName] = useState<string>("ALL");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchArticles = async () => {
    const { errors, data } = await client.models.Article.list({
      limit: 10000,
    });
    if (errors !== undefined || data == null) {
      console.error("error:", errors, "data:", data);
      throw new Error("Failed to get Article.")
    }
    console.debug(data);
    setArticles(data);
    setSiteNames(["ALL", ...new Set(data.map(d => d.siteName))]);
    setFilteredArticles(filterArticles(selectedSiteName));
  };

  useEffect(() => {
    fetchArticles();
  }, []);


  const filterArticles = (siteName: string) => siteName === "ALL" ? articles : articles.filter(a => a.siteName === siteName);

  /////////// onClick ///////////
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const filter = (e: React.MouseEvent<HTMLDivElement>) => {
    const siteName = (e.target as HTMLDivElement).dataset.sitename;
    if (siteName) {
      setSelectedSiteName(siteName);
      toggleMenu();
    } else {
      alert("要素取得に失敗");
    }
  };

  return (
    <>
      <Header hasHamburger={true} onClickFn={toggleMenu}></Header>
      <Authenticator hideSignUp className="mt-4">
        <AppVersion></AppVersion>
        <div>
          <div className="border-b-[1px] border-b-slate-600 text-center text-4xl p-2">
            {selectedSiteName}
          </div>
        </div>
        <Menu isMenuOpen={isMenuOpen} siteNames={siteNames} onClickFn={filter}></Menu>
        <ArticleList articles={filteredArticles}></ArticleList>
      </Authenticator>
    </>
  );
}