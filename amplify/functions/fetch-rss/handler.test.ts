import { assert, describe, it } from "vitest";
import { Rss } from "../../../src/app/lib/types";
import { parseXml } from "./handler";

describe("parseXml", () => {
    it("正常系", async () => {
        const xml = `
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <channel>
                    <title>blog title</title>
                    <link>https://hogehoge/</link>
                    <description>blog description</description>
                    <lastBuildDate>Mon, 23 Dec 2024 22:18:04 +0900</lastBuildDate>
                    <docs>http://hogehoge/rss</docs>
                    <generator>Hoge Blog</generator>
                    <item>
                        <title>item 1</title>
                        <link>https://hoge/item1</link>
                        <description>description 1</description>
                        <pubDate>Mon, 23 Dec 2024 22:18:04 +0900</pubDate>
                        <guid isPermaLink="false">hoge</guid>
                        <enclosure url="https://ogimage.blog.st-hatena.com/6653812171394033897/6802418398313973925/1734977743" type="image/png" length="0" />
                    </item>
                    <item>
                        <title>item 2</title>
                        <link>https://hoge/item2</link>
                        <description>description 2</description>
                        <pubDate>Mon, 23 Dec 2024 22:18:04 +0900</pubDate>
                        <guid isPermaLink="false">hoge</guid>
                        <enclosure url="https://ogimage.blog.st-hatena.com/6653812171394033897/6802418398313973925/1734977743" type="image/png" length="0" />
                    </item>
                </channel>
        `;

        const expected: Rss = {
            channel: {
                title: "blog title",
                link: "https://hogehoge/",
                description: "blog description",
                lastBuildDate: "Mon, 23 Dec 2024 22:18:04 +0900",
                docs: "http://hogehoge/rss",
                generator: "Hoge Blog",
                item: [
                    {
                        title: "item 1",
                        link: "https://hoge/item1",
                        description: "description 1",
                        pubDate: "Mon, 23 Dec 2024 22:18:04 +0900",
                        guid: {
                            "#text": "hoge",
                            "@_isPermaLink": "false",
                        },
                        enclosure: {
                            "@_url": "https://ogimage.blog.st-hatena.com/6653812171394033897/6802418398313973925/1734977743",
                            "@_type": "image/png",
                            "@_length": "0",
                        },
                    },
                    {
                        title: "item 2",
                        link: "https://hoge/item2",
                        description: "description 2",
                        pubDate: "Mon, 23 Dec 2024 22:18:04 +0900",
                        guid: {
                            "#text": "hoge",
                            "@_isPermaLink": "false",
                        },
                        enclosure: {
                            "@_url": "https://ogimage.blog.st-hatena.com/6653812171394033897/6802418398313973925/1734977743",
                            "@_type": "image/png",
                            "@_length": "0",
                        },
                    },
                ],
            },
        };
        
        const actual: Rss = parseXml(xml);
        assert.deepEqual(actual, expected)
    });
})