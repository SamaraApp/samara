import { expect } from "chai";
import { ProviderName, ProviderType, RadiantProvider } from "@/types/provider";
import RadiantInject from "../inject";
import { MessageMethod, EmitEvent } from "../types";
import { OnMessageResponse } from "@samaraapp/types";
import { SamaraWindow } from "@/types/globals";

const providerSendMessage = async (
  provider: ProviderName,
  message: string
): Promise<OnMessageResponse> => {
  return {
    result: `dummy-response-${provider}-${message}`,
  };
};
const options = {
  name: ProviderName.radiant,
  type: ProviderType.radiant,
  sendMessageHandler: providerSendMessage,
};
const tempWindow: SamaraWindow = {
  samara: {
    providers: {},
    settings: {
      rvm: {
        inject: {
          disabled: false,
          timestamp: 0,
        },
      },
    },
  },
};
describe("Test injected Radiant", () => {
  it("should have default values", async () => {
    RadiantInject(tempWindow, options);
    const provider = tempWindow[ProviderName.radiant] as RadiantProvider;
    expect(provider.name).to.equal(ProviderName.radiant);
    expect(provider.chainId).to.equal(null);
    expect(provider.isSamara).to.equal(true);
  });
});

describe("Test emitted events", () => {
  it("should emit chainChanged", (done) => {
    RadiantInject(tempWindow, options);
    const provider = tempWindow[ProviderName.radiant] as RadiantProvider;
    const chainId = "0x5";
    provider.on(EmitEvent.chainChanged, (_chainId) => {
      expect(provider.chainId).to.equal(chainId);
      expect(_chainId).to.equal(chainId);
      done();
    });
    provider.handleMessage(
      JSON.stringify({
        method: MessageMethod.changeChainId,
        params: ["0x5"],
      })
    );
  });
  it("should emit accountsChanged", (done) => {
    RadiantInject(tempWindow, options);
    const provider = tempWindow[ProviderName.radiant] as RadiantProvider;
    const address = "0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D";
    provider.on(EmitEvent.accountsChanged, (addresses) => {
      expect(addresses).deep.equal([address]);
      expect(provider.selectedAddress).to.deep.equal(address);
      done();
    });
    provider.handleMessage(
      JSON.stringify({
        method: MessageMethod.changeAddress,
        params: [address],
      })
    );
  });
  it("should emit connect", (done) => {
    RadiantInject(tempWindow, options);
    const provider = tempWindow[ProviderName.radiant] as RadiantProvider;
    const chainId = "0x5";
    provider.on(EmitEvent.connect, (connectionInfo) => {
      expect(connectionInfo).deep.equal({
        chainId,
      });
      expect(provider.chainId).to.equal(chainId);
      done();
    });
    provider.handleMessage(
      JSON.stringify({
        method: MessageMethod.changeConnected,
        params: [true, chainId],
      })
    );
  });
  it("should emit disconnect", (done) => {
    RadiantInject(tempWindow, options);
    const provider = tempWindow[ProviderName.radiant] as RadiantProvider;
    const disconnectCode = 4901;
    provider.on(EmitEvent.disconnect, (connectionInfo) => {
      expect(connectionInfo).deep.equal({
        code: 4901,
        message:
          "Chain Disconnected: The Provider is not connected to the requested chain.",
      });
      expect(provider.isConnected()).to.equal(false);
      done();
    });
    provider.handleMessage(
      JSON.stringify({
        method: MessageMethod.changeConnected,
        params: [false, disconnectCode],
      })
    );
  });
});
