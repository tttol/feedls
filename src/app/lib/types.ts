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

export interface Guid {
    "#text": string;
    "@_isPermaLink": string;
}

export interface Enclosure {
    "@_url": string;
    "@_type": string;
    "@_length": string;
}

export interface BlogData {
    channel: Channel;
}