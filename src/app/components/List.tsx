import { Schema } from "../../../amplify/data/resource";
import Article from "./Article";

export default function List({ articles }: { articles: Schema["Article"]["type"][] }) {
  return (
    <>
      {
        articles.map(a => (
          <Article article={a} key={a.id}></Article>
        ))
      }
    </>
  );
}