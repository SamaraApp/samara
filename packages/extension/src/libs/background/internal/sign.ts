import { getCustomError } from "@/libs/error";
import KeyRingBase from "@/libs/keyring/keyring";
import { InternalOnMessageResponse } from "@/types/messenger";
import { SamaraAccount, RPCRequestType } from "@samaraapp/types";

const sign = (
  keyring: KeyRingBase,
  message: RPCRequestType
): Promise<InternalOnMessageResponse> => {
  if (!message.params || message.params.length < 2)
    return Promise.resolve({
      error: getCustomError("background: invalid params for signing"),
    });
  const tx = message.params[0];
  const account = message.params[1] as SamaraAccount;
  return keyring
    .sign(tx, account)
    .then((rawtx) => {
      console.log("rawtx", rawtx);
      return {
        result: rawtx,
      };
    })
    .catch((e) => {
      return {
        error: getCustomError(e.message),
      };
    });
};

export default sign;
