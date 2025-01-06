import { Schema } from "../../../amplify/data/resource";
import Article from "./Article";

export default function ArticleList({ articles }: { articles: Schema["Article"]["type"][] }) {
  return (
    <>
      {
        articles
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .map(a => (
            <Article article={a} key={a.id}></Article>
          ))
      }
    </>
  );
}