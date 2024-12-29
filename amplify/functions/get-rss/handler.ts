import { Schema } from '../../data/resource';

export const handler: Schema["getRss"]["functionHandler"] = async (event, context) => {
  // your function code goes here
  return 'Hello, Feedls!';
};