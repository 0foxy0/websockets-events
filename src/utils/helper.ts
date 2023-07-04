export const createUUID = (): string => {
  const uuidFormat = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let unixTime = new Date().getTime();

  const replaceCharWithRandomHex = (char: string) => {
    const result = (unixTime + Math.random() * 16) % 16 | 0;
    unixTime = Math.floor(unixTime / 16);

    return (char === "x" ? result : (result & 0x3) | 0x8).toString(16);
  };

  return uuidFormat.replace(/[xy]/g, replaceCharWithRandomHex);
};
