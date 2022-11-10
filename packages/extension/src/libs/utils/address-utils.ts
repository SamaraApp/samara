import bs58check from "bs58check";

export const isValidAddress = function (hexAddress: string): boolean {
  try {
    const addressDecoded = bs58check.decode(hexAddress);
    return /^[0-9a-zA-Z]+$/.test(hexAddress) && !!addressDecoded;
  } catch (err) {
    console.log("isValidAddress Error", err);
  }
  return false;
}