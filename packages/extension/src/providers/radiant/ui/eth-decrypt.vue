<template>
  <common-popup>
    <template #header>
      <sign-logo class="common-popup__logo" />
    </template>

    <template #content>
      <h2>Decrypt Message</h2>

      <div class="common-popup__block">
        <div class="common-popup__account">
          <img :src="identicon" />
          <div class="common-popup__account-info">
            <h4>{{ account.name }}</h4>
            <p>
              {{ $filters.replaceWithEllipsis(account.address, 6, 4) }}
            </p>
          </div>
        </div>
      </div>
      <div class="common-popup__block">
        <div class="common-popup__info">
          <img :src="Options.faviconURL" />
          <div class="common-popup__info-info">
            <h4>{{ Options.domain }}</h4>
          </div>
        </div>

        <p class="common-popup__message">
          {{ Options.domain }} would like to decrypt message
        </p>
      </div>
    </template>

    <template #button-left>
      <base-button title="Cancel" :click="deny" :no-background="true" />
    </template>

    <template #button-right>
      <base-button title="Provide" :click="approve" />
    </template>
  </common-popup>
</template>

<script setup lang="ts">
import SignLogo from "@action/icons/common/sign-logo.vue";
import BaseButton from "@action/components/base-button/index.vue";
import CommonPopup from "@action/views/common-popup/index.vue";
import { SamaraAccount } from "@samaraapp/types";
import { getError } from "@/libs/error";
import { ErrorCodes } from "@/providers/radiant/types";
import { WindowPromiseHandler } from "@/libs/window-promise";
import { InternalMethods } from "@/types/messenger";
import { onBeforeMount, ref } from "vue";
import {
  DEFAULT_RVM_NETWORK_NAME,
  getNetworkByName,
} from "@/libs/utils/networks";
import { ProviderRequestOptions } from "@/types/provider";
import { RvmNetwork } from "../types/rvm-network";

const windowPromise = WindowPromiseHandler(3);
const network = ref<RvmNetwork>(
  getNetworkByName(DEFAULT_RVM_NETWORK_NAME) as RvmNetwork
);
const account = ref<SamaraAccount>({
  name: "",
  address: "",
} as SamaraAccount);
const identicon = ref<string>("");
const Options = ref<ProviderRequestOptions>({
  domain: "",
  faviconURL: "",
  title: "",
  url: "",
  tabId: 0,
});
onBeforeMount(async () => {
  const { Request, options } = await windowPromise;
  network.value = getNetworkByName(Request.value.params![2]) as RvmNetwork;
  account.value = Request.value.params![1] as SamaraAccount;
  identicon.value = network.value.identicon(account.value.address);
  Options.value = options;
});
const approve = async () => {
  const { Request, sendToBackground, Resolve } = await windowPromise;
  const encryptedMessage = Request.value.params![0] as string;
  sendToBackground({
    method: InternalMethods.ethereumDecrypt,
    params: [encryptedMessage, account.value],
  }).then((res) => {
    if (res.error) {
      Resolve.value(res);
    } else {
      Resolve.value({
        result: JSON.stringify(res.result),
      });
    }
  });
};
const deny = async () => {
  const { Resolve } = await windowPromise;
  Resolve.value({
    error: getError(ErrorCodes.userRejected),
  });
};
</script>

<style lang="less" scoped>
@import "~@/providers/radiant/ui/styles/common-popup.less";
</style>
