import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { fetchRss } from '../functions/fetch-rss/resource';

const schema = a.schema({
  fetchRss: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function(fetchRss)),
  Article: a
    .model({
      siteName: a.string(),
      title: a.string(),
      link: a.string(),
      aiSummary: a.string(),
      isRead: a.boolean(),
      isDeleted: a.boolean(),
      publishedAt: a.string(),
      fetchedAt: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
  FetchedHistory: a
    .model({
      fetchedAt: a.string(),
    })
    .authorization((allow) => [allow.guest()]),

  // batchPutItemToArticles: a
  //   .mutation()
  //   .arguments({
  //     siteName: a.string(),
  //     title: a.string(),
  //     link: a.string(),
  //     aiSummary: a.string(),
  //     isRead: a.boolean(),
  //     isDeleted: a.boolean(),
  //     publishedAt: a.string(),
  //     fetchedAt: a.string(),
  //   })
  //   .returns(a.ref("Article"))
  //   .authorization(allow => [allow.guest()])
  //   .handler(
  //     a.handler.custom({
  //       dataSource: "ExternalPostTableDataSource",
  //       entry: "./batchPutItemToArticles.js",
  //     })
  //   ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
  functions: {
    fetchRss: fetchRss
  }
});