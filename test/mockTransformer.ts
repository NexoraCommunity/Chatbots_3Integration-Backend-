export const pipeline = jest.fn(async () => {
  return async (text: string) => ({
    data: new Array(384).fill(0.1),
  });
});
