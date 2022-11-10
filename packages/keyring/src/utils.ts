import { SignerType } from "@samaraapp/types";

export const pathParser = (
  basePath: string,
  index: number,
  type: SignerType
): string => {
  if (
    [SignerType.ecdsa].includes(type) &&
    basePath === "//"
  ) {
    return index === 0 ? "" : `//${--index}`;
  }
  return `${basePath}/${index}`;
};
