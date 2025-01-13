import Image from "next/image";
import { Schema } from "../../../amplify/data/resource";
import noImage from "./../img/noimage.png";
import { makeRead } from "../lib/actions";

export default function Article({ article }: { article: Schema["Article"]["type"] }) {
  return (
    <div className="flex border-b-[1px] border-b-slate-400">
      <div className="w-3/4 p-1">
        <div>
          <a href={article.link} target="_blank" onClick={() => makeRead(article.id)}>
            <div className={article.isRead ? "" : "font-bold"}>
              {!article.isRead && <div className="w-2 h-2 inline-block mr-2 bg-blue-500 rounded-full"></div>}
              {article.title}
            </div>
            <div className="text-slate-500">{article.siteName} / {new Date(article.publishedAt).toLocaleString()}</div>
          </a>
        </div>
      </div>
      <div className="w-1/4 p-1">
        {article.enclosureType === "image/png" ?
          <img src={article.enclosureUrl ?? noImage.blurDataURL} alt="OGP" /> :
          <Image src={noImage} alt="next"></Image>}
      </div>
    </div>
  );
}