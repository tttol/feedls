import { Schema } from '../../data/resource';

export const handler: Schema["fetchRss"]["functionHandler"] = async (event, context) => {
  
  return 'Hello, Feedls!';
};