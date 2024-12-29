import { defineFunction } from '@aws-amplify/backend';

export const getRss = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'get-rss',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});