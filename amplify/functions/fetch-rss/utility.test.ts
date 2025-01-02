import { assert, describe, it, vi } from "vitest";
import { Item, Rss } from "../../../src/app/lib/types";
import { generateDataUnit, parseXml } from "./utility";

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


vi.mock("@aws-appsync/utils", () => ({
    util: {
        dynamodb: {
            toMapValues: (input: any) => input,
        },
    },
}));
describe("generateDataUnit", () => {
    it("30件_pubDateが全て未来", async () => {
        const items: Item[] = [...new Array(30).keys()].map(index => {
            const item = {
                title: "title " + index,
                link: "https://hoge" + index,
                description: "desc " + index,
                pubDate: "Mon, 23 Dec 2024 18:00:00 GMT",
                guid: {
                    "#text": "hoge",
                    "@_isPermaLink": "false",
                },
                enclosure: {
                    "@_url": "https://ogimage.hoge" + index,
                    "@_type": "image/png",
                    "@_length": "0",
                },
            };
            return item;
        });

        const currentTimeStr = new Date().toISOString();
        const lastFetchedTime = new Date(1970, 1, 1);
        const actual = generateDataUnit(items, currentTimeStr, lastFetchedTime, 0);

        assert.equal(actual.length, 25);
    });
    it("10件_pubDateが全て未来", async () => {
        const items: Item[] = [...new Array(10).keys()].map(index => {
            const item = {
                title: "title " + index,
                link: "https://hoge" + index,
                description: "desc " + index,
                pubDate: "Mon, 23 Dec 2024 18:00:00 GMT",
                guid: {
                    "#text": "hoge",
                    "@_isPermaLink": "false",
                },
                enclosure: {
                    "@_url": "https://ogimage.hoge" + index,
                    "@_type": "image/png",
                    "@_length": "0",
                },
            };
            return item;
        });

        const currentTimeStr = new Date().toISOString();
        const lastFetchedTime = new Date(1970, 1, 1);
        const actual = generateDataUnit(items, currentTimeStr, lastFetchedTime, 0);

        assert.equal(actual.length, 10);
    });
    it("2件_内1件はpubDateが過去", async () => {
        const items = [
            {
                title: "title ",
                link: "https://hoge",
                description: "desc ",
                pubDate: "Mon, 23 Dec 2024 00:00:00 GMT", // pubDate < lastFetchedTime
                guid: {
                    "#text": "hoge",
                    "@_isPermaLink": "false",
                },
                enclosure: {
                    "@_url": "https://ogimage.hoge",
                    "@_type": "image/png",
                    "@_length": "0",
                },
            },
            {
                title: "title ",
                link: "https://hoge",
                description: "desc ",
                pubDate: "Wed, 1 Jan 2025 00:00:00 GMT", // lastFetchedTime < pubDate
                guid: {
                    "#text": "hoge",
                    "@_isPermaLink": "false",
                },
                enclosure: {
                    "@_url": "https://ogimage.hoge",
                    "@_type": "image/png",
                    "@_length": "0",
                },
            },
        ]
        const currentTimeStr = new Date().toISOString();
        const lastFetchedTime = new Date(2024, 12, 31);
        const actual = generateDataUnit(items, currentTimeStr, lastFetchedTime, 0);

        assert.equal(actual.length, 1);
    });
});