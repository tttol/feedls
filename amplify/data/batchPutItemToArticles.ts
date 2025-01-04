// import { util } from '@aws-appsync/utils';

// export function request(ctx) {
//   const { authorId, postId, name, title } = ctx.args;
//   return {
//     operation: 'BatchPutItem',
//     tables: {
//       Article: [util.dynamodb.toMapValues({ authorId, name })],
//     },
//   };
// }