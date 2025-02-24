export const progress = async (
  message: string,
  action: () => Promise<unknown>,
): Promise<void> => {
  process.stdout.write(message);
  await action();

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
};
