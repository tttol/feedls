"use client"
import Form from 'next/form';
import { useState } from "react";
import { Schema } from "../../../../amplify/data/resource";

export default function ReadgingList({ readingList }: { readingList: Schema["ReadingList"]["type"][] }) {
  const [added, setAdded] = useState<number[]>([]);
  const append = () => {
    setAdded(prev => [...prev, prev.length])
  }
  return (
    <>
      {readingList.map(r => (
        <div key={r.id} className="">
          <Form action="" className="flex items-baseline p-3">
            <div className="mr-2 w-1/2">{r.title}</div>
            <input type="url" name="rssUrl" placeholder="RSS URL" value={r.url} className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white" />
            <input type="submit" value="Update" className="bg-green-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-1" />
          </Form>
        </div>
      ))}
      {added.map(a => (
        <div key={a} className="">
          <Form action="" className="flex items-baseline p-3">
            <div className="mr-2 w-1/2">-</div>
            <input type="url" name="rssUrl" placeholder="RSS URL" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-slate-800 bg-white" />
            <input type="submit" value="Add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg ml-1" />
          </Form>
        </div>
      ))}
      <div className="m-3" onClick={append}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-10 ml-auto rounded-full bg-slate-600 p-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>

    </>
  );
}