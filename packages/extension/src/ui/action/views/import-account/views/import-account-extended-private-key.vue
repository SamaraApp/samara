<template>
  <import-account-header v-bind="$attrs" :is-back="true" />

  <div
    class="import-account-extended-private-key"
    :class="{ process: isProcessing }"
  >
    <h2>Import account with Extended Private Key (xprv)</h2>
    <p class="import-account-extended-private-key__desc">
      Enter your extended private key (xprv) string here
    </p>

    <textarea
      v-model="extendedPrivKey"
      autocomplete="off"
      class="import-account-extended-private-key__input"
      :class="{ error: !isValidKey }"
      placeholder="Extended Private key"
      autofocus
      @change="onInput"
      @keyup.enter="importAction"
    >
    </textarea>

    <p class="import-account-extended-private-key__already_exists">
      {{ accountAlreadyExists ? "This account has already been added" : "" }}
    </p>

    <base-button
      title="Import account"
      :click="importAction"
      :disabled="!isValidKey"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ImportAccountHeader from "../components/import-account-header.vue";
import BaseButton from "@action/components/base-button/index.vue";
import Wallet from "ethereumjs-wallet";
import { hexToBuffer } from "@samaraapp/utils";
import { KeyPairAdd, SignerType } from "@samaraapp/types";
import PublicKeyRing from "@/libs/keyring/public-keyring";
import bs58check from "bs58check";
import {
  hash160BufToAddress,
  hash160HexToAddress,
  addressToHash160,
} from "@/libs/radiant-helpers/radiant-core-helpers";
import * as radiantjs from "@radiantblockchain/radiantjs";

const isProcessing = ref(false);
const extendedPrivKey = ref("");
const keyring = new PublicKeyRing();

const emit = defineEmits<{
  (e: "update:wallet", keypair: KeyPairAdd): void;
}>();

const accountAlreadyExists = ref(false);

const formattedExtendedPrivateKey = computed(() =>
  extendedPrivKey.value.trim()
);

const isValidKey = computed(() => {
  try {
    new radiantjs.HDPrivateKey(formattedExtendedPrivateKey.value);
    return true;
  } catch (e) {
    console.log("isValidKey error", e);
    return false;
  }
});

const onInput = () => {
  accountAlreadyExists.value = false;
};

const importAction = async () => {
  const hdKey = new radiantjs.HDPrivateKey(formattedExtendedPrivateKey.value);
  const childKey = hdKey.deriveChild("m/44'/0'/0'/0/0");
  const privateKey = childKey.privateKey;
  const newAddress = privateKey.publicKey.toAddress().toString();
  if (await keyring.accountAlreadyAdded(newAddress)) {
    accountAlreadyExists.value = true;
    return;
  }
  emit("update:wallet", {
    privateKey: privateKey.toString(),
    publicKey: privateKey.publicKey.toString(),
    address: newAddress,
    name: "",
    signerType: SignerType.secp256k1,
  });
};
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.import-account-extended-private-key {
  width: 100%;

  &.process {
    height: 228px;
    overflow: hidden;
  }

  h2 {
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 0.25px;
    color: @primaryLabel;
    margin: 0 0 24px 0;
  }

  &__desc {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: @secondaryLabel;
    margin: 0 0 8px 0;
  }

  &__input {
    width: 100%;
    height: auto;
    background: @bgsecondary;
    font-family: "Roboto";
    box-sizing: border-box;
    border-radius: 10px;
    margin-bottom: 8px;
    resize: none;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: @primaryLabel;
    outline: none !important;
    padding: 10px 12px;
    border: 2px solid @primary;
    &.error {
      border: 2px solid @error;
    }
  }

  &__already_exists {
    color: @error;
    height: 14px;
    text-align: left;
    margin: 0px;
    margin-bottom: 16px;
  }
}
</style>
