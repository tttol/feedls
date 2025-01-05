import Image from "next/image";
import { Schema } from "../../../amplify/data/resource";
import noImage from "./../img/noimage.png";

export default function Article({ article }: { article: Schema["Article"]["type"] }) {
  console.log(noImage.blurDataURL);
  return (
    <div className="flex border-b-[1px] border-b-slate-400">
      <div className="w-3/4 p-1">
        <div>
          <a href={article.link} target="_blank">
            <div className="font-bold">{article.title}</div>
            <div className="text-slate-500">{article.siteName}</div>
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