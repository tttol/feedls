import { RssObj } from "@/app/lib/types";
import { fetchRss, parseXml } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { Schema } from "../../../../amplify/data/resource";
import { createReading, deleteReading } from "../lib/actions";

export default function ReadgingList({ readingList }: { readingList: Schema["ReadingList"]["type"][] }) {
  const initUpdateList = () => readingList.map((r, i) => ({ id: r.id, title: r.title, url: r.url }));
  const [updateList, setUpdateList] = useState<{ id: string, title: string, url: string }[]>(initUpdateList);
  const [newTitleList, setNewTitleList] = useState<{ [key: number]: string }>({});
  const [emptyArr, setEmptyArr] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setUpdateList(initUpdateList);
  }, [readingList]);

  const append = () => {
    setEmptyArr(prev => [...prev, prev.length]);
  };

  const handleUpdateChange = async (index: number, id: string, url: string) => {
    const title = await fetchTitle(url);
    setUpdateList(updateList.map((u, i) => i === index ? { id: id, title: title, url: url } : u))
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
      setErrorMessage(`Failed to fetch URL[${url}]. ${e}`);
      return;
    }
  }

  const del = (id: string) => {
    if (!window.confirm("Are you sure to delete reading?")) return;

    deleteReading(id);
    location.reload();
  }

  return (
    <>
      <div className="text-red-500">{errorMessage}</div>
      {updateList.length === 0 && <p className="p-3">There are no reading list.</p>}
      {updateList.map((u, i) => (
        <div key={i} className="">
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              await createReading(formData);
              location.reload();
            } catch (e) {
              alert(`Failed to create. ${JSON.stringify(e)}`);
            }
          }} className="p-3">
            <div className="flex items-baseline">
              <div className="mr-2 w-1/2">{u.title}</div>
              <input
                type="url"
                name="rssUrl"
                placeholder="RSS URL"
                value={u?.url}
                onChange={e => handleUpdateChange(i, u.id, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white"
              />
              <div className="mt-2" onClick={() => del(u.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline">
              <input type="submit" value="Update" className="bg-green-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-auto block mt-2" />
            </div>
          </form>
        </div>
      ))}
      {emptyArr.map(a => (
        <div key={a} className="">
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              await createReading(formData);
              location.reload();
            } catch (e: unknown) {
              alert(`Failed to create. ${e}`);
            }
          }} className="p-3">
            <div className="flex items-baseline">
              <div className="mr-2 w-1/2">{newTitleList[a] || "-"}</div>
              <input type="hidden" name="title" value={newTitleList[a] || ""} />
              <input
                type="url"
                name="rssUrl"
                placeholder="RSS URL"
                onBlur={e => handleAddedChange(a, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white"
              />
            </div>
            <input type="submit" value="Add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-auto block mt-2" />
          </form>
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