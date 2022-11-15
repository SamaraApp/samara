<template>
  <div class="add-network__container">
    <div class="add-network__overlay" @click="emit('close:popup')" />
    <div class="add-network__wrap">
      <add-network-list
        v-if="isNetworkList"
        :networks="networks"
        :close="closePopup"
        :selected="selected"
        :to-custom="toCustomNetwork"
        :toEditNetworkSettings="() => toEditNetworkSettings()"
        @update:active-networks="setActiveNetworks"
        @update:order="(e) => emit('update:order', e)"
        @update:network="(e) => emit('update:network', e)"
      />
      <edit-network-settings
        v-if="false"
        :networks="networks"
        :close="closePopup"
        :selected="selected"
        :to-custom="toCustomNetwork"
        @update:active-networks="setActiveNetworks"
        @update:order="(e) => emit('update:order', e)"
        @update:network="(e) => emit('update:network', e)"
      />
      <add-custom-network
        v-if="!isNetworkList"
        :close="closePopup"
        :back="toNetworkList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import AddNetworkList from "./views/add-network-list.vue";
import AddCustomNetwork from "./views/add-custom-network.vue";
import EditNetworkSettings from "./views/edit-network-settings.vue";
import { NetworkItem } from "@action/types/network";
import { BaseNetwork } from "@/types/base-network";

const isNetworkList = ref(true);
const isNetworkSettings = ref(false);

defineProps({
  networks: {
    type: Array as PropType<Array<NetworkItem>>,
    default: () => [],
  },
  selected: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "close:popup"): void;
  (e: "update:activeNetworks"): void;
  (e: "update:network", network: BaseNetwork): void;
  (e: "update:order", networks: BaseNetwork[]): void;
}>();

const setActiveNetworks = () => {
  emit("update:activeNetworks");
};

const closePopup = () => {
  emit("close:popup");
};

const toCustomNetwork = () => {
  isNetworkList.value = false;
};

const toEditNetworkSettings = () => {
  console.log("set network set");
  isNetworkSettings.value = true;
};

const toNetworkList = () => {
  isNetworkList.value = true;
};
</script>

<style lang="less" scoped>
@import "~@action/styles/theme.less";
@import "~@action/styles/custom-scroll.less";

.add-network {
  width: 100%;
  height: auto;
  box-sizing: border-box;

  &__wrap {
    background: #222222;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.039),
      0px 7px 24px rgba(0, 0, 0, 0.19);
    border-radius: 12px;
    box-sizing: border-box;
    width: 460px;
    height: auto;
    z-index: 107;
    position: fixed;
    height: 100%;
    overflow-x: hidden;
  }

  &__container {
    width: 460px;
    height: 600px;
    left: 0px;
    top: 0px;
    position: fixed;
    z-index: 105;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  &__overlay {
    background: rgba(0, 0, 0, 0.32);
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: absolute;
    z-index: 106;
  }
}
</style>
