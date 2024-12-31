import { defineFunction } from '@aws-amplify/backend';

export const fetchRss = defineFunction({
  name: 'fetch-rss',
  entry: './handler.ts',
  timeoutSeconds: 60, 
});