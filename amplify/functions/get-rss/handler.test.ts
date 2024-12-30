import { assert, describe, expect, it } from "vitest";
import { parseXml } from "./handler";

describe("parseXml", () => {
    it("正常系", async () => {
        const xml = "<entry>"
            + "<title>title</title>"
            + "<link href= \"https://hogehoge\"/>"
            + "<id>abc12345</id>"
            + "<published>2024-12-23T22:18:04+09:00</published>"
            + "<updated>2024-12-24T03:15:43+09:00</updated><summary type= \"html\">summary</summary>"
            + "<content type= \"html\">content</content>"
            + "<link rel= \"enclosure\" href= \"https://ogimage.hogehoge\" type=\"image/png\" length= \"0\" />"
            + "<author><name>john</name></author>"
            + "</entry>";

        const actual: { [key: string]: any } = parseXml(xml);
        assert.isNotNull(actual["entry"]);
        const actualEntry = actual["entry"];
        expect(actualEntry["title"]).toEqual("title");
        expect(actualEntry["link"][0]["@_href"]).toEqual("https://hogehoge");
        expect(actualEntry["id"]).toEqual("abc12345");
        expect(actualEntry["published"]).toEqual("2024-12-23T22:18:04+09:00");
        expect(actualEntry["updated"]).toEqual("2024-12-24T03:15:43+09:00");
    });
})