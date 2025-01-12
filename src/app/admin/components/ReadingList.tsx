import { RssObj } from "@/app/lib/types";
import { fetchRss, parseXml } from "@/app/lib/utils";
import Form from "next/form";
import { useEffect, useState } from "react";
import { Schema } from "../../../../amplify/data/resource";
import createReading from "../lib/actions";

export default function ReadgingList({ readingList }: { readingList: Schema["ReadingList"]["type"][] }) {
  const initUpdateList = () => readingList.map((r, i) => ({title: r.title, url: r.url}));
  const [updateList, setUpdateList] = useState<{title: string, url: string}[]>(initUpdateList);
  const [newTitleList, setNewTitleList] = useState<{ [key: number]: string }>({});
  const [emptyArr, setEmptyArr] = useState<number[]>([]);

  useEffect(() => {
    setUpdateList(initUpdateList);
  }, [readingList]);
  
  const append = () => {
    setEmptyArr(prev => [...prev, prev.length]);
  };

  const handleUpdateChange = async (index: number, url: string) => {
    const title = await fetchTitle(url);
    setUpdateList(updateList.map((u, i) => i === index ? {title: title, url: url} : u))
  }
  
  const handleAddedChange = async (index: number, url: string) => {
    const title = await fetchTitle(url);
    setNewTitleList(prev => ({ ...prev, [index]: title }));
  }
  
  const fetchTitle = async (url: string) => {
    const rss: RssObj | undefined = await fetch(url);
    const title = rss?.rss.channel.title ?? "";

    return title;
  };

  const fetch = async (url: string) => {
    try {
      const responseXml = await fetchRss(url);
      return parseXml(responseXml);
    } catch (e) {
      alert(`Failed to fetch URL. ${e}`);
      return;
    }
  }


  return (
    <>
      {updateList.map((u, i) => (
        <div key={i} className="">
          <Form action={createReading} className="flex items-baseline p-3">
            <div className="mr-2 w-1/2">{u.title}</div>
            <input
              type="url"
              name="rssUrl"
              placeholder="RSS URL"
              value={u?.url}
              onChange={e => handleUpdateChange(i, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white"
            />
            <input type="submit" value="Update" className="bg-green-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-1" />
          </Form>
        </div>
      ))}
      {emptyArr.map(a => (
        <div key={a} className="">
          <Form action={createReading} className="flex items-baseline p-3">
            <div className="mr-2 w-1/2">{newTitleList[a] || "-"}</div>
            <input type="hidden" name="title" value={newTitleList[a] || ""} />
            <input
              type="url"
              name="rssUrl"
              placeholder="RSS URL"
              onBlur={e => handleAddedChange(a, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white"
            />
            <input type="submit" value="Add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-1" />
          </Form>
        </div>
      ))}
      <div className="m-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-10 ml-auto rounded-full bg-slate-600 p-1" onClick={append}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </>
  );
}