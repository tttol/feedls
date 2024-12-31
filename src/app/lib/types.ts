export interface Rss {
    channel: Channel;
}

interface Channel {
    title: string;
    link: string;
    description: string;
    lastBuildDate: string;
    docs: string;
    generator: string;
    item: Item[];
}

export interface Item {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: Guid;
    enclosure: Enclosure;
}

interface Guid {
    "#text": string;
    "@_isPermaLink": string;
}

interface Enclosure {
    "@_url": string;
    "@_type": string;
    "@_length": string;
}

interface BlogData {
    channel: Channel;
}