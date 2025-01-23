import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { fetchRss } from '../functions/fetch-rss/resource';

const schema = a.schema({
  fetchRss: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(fetchRss)),
  Article: a
    .model({
      siteName: a.string().required(),
      title: a.string().required(),
      link: a.string().required(),
      enclosureUrl: a.url(),
      enclosureType: a.string(),
      aiSummary: a.string(),
      isRead: a.boolean().required(),
      isDeleted: a.boolean().required(),
      publishedAt: a.string().required(),
      fetchedAt: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
  FetchedHistory: a
    .model({
      fetchedAt: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
  ReadingList: a
    .model({
      title: a.string().required(),
      url: a.url().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

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
})
.authorization(allow => [allow.resource(fetchRss)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});