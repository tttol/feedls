
export function request(target: any) {
    return {
        operation: 'BatchPutItem',
        tables: {
          Article: target,
        },
      };
}