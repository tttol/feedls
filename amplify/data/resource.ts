import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { getRss } from '../functions/get-rss/resource';

const schema = a.schema({
  getRss: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function(getRss)),
  // Rss: a
  //   .model({
  //     title: a.string(),
  //     link: a.string(),
  //     ai_summary: a.string(),
  //     is_read: a.boolean(),
  //     is_deleted: a.boolean(),
  //     published_at: a.string(),
  //     updated_at: a.string(),
  //     fetched_at: a.string(),
  //   })
  //   .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
