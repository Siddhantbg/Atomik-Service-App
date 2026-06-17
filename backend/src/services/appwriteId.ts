/** Appwrite-compatible unique id (no SDK required). */
export const ID = {
  unique(): string {
    const part = () =>
      Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, '0');
    return `${part()}${part()}${part()}${part()}`.slice(0, 20);
  },
};
