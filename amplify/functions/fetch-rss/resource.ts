import { defineFunction } from '@aws-amplify/backend';

export const fetchRss = defineFunction({
  name: 'fetch-rss',
  entry: './handler.ts',
  timeoutSeconds: 60, 
  runtime: 22, // Node.js v22
});