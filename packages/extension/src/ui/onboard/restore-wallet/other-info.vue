<template>
  <div class="restore-wallet-other-info">
    <custom-scrollbar
      class="restore-wallet-other-info__scroll-area"
      :settings="scrollSettings({ suppressScrollX: true })"
    >
      <h3>Safety and security is our top priority</h3>
      <p>
        We do not support keystore files or private key imports in Samara, as
        they are very unsecure and unsafe.
      </p>
      <p>
        For maximum security it is best to create a fresh wallet directly inside
        Samara, just like you got a new hardware wallet. That way you can
        be certain your keys never leave your device.
      </p>
      <p>
        If you want to access funds in one of your existing wallets via Samara,
        the most secure way is to create a new wallet and transfer your RXD and
        Tokens to the new wallet.
      </p>
      <p>Using your existing private key considerably reduces your security.</p>
    </custom-scrollbar>
  </div>
</template>
<script setup lang="ts">
import CustomScrollbar from "@action/components/custom-scrollbar/index.vue";
import scrollSettings from "@/libs/utils/scroll-settings";
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.restore-wallet-other-info {
  h3 {
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 0.25px;
    color: @primaryLabel;
    margin: 0 0 16px 0;
  }

  p {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    margin: 0 0 16px 0;
  }

  &__scroll-area {
    position: relative;
    margin: auto;
    width: calc(~"100% + 15px");
    max-height: 488px;
    padding-right: 15px;
    box-sizing: border-box;
  }
}
</style>
