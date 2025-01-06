import { Schema } from "../../../../amplify/data/resource";

export default function ReadgingList({ readingList }: { readingList: Schema["ReadingList"]["type"][] }) {
  return (
    <>
      {readingList.map(r => {
        <div>
          <form action="">
            <div>Title: {r.title}</div>
            <div>
              URL: <input type="url" />
            </div>
          </form>
        </div>
      })}
    </>
  );
}