<template>
  <div class="network-picker">
    <div class="network-picker__label">
      <div class="network-picker__label-name">
        {{network.name}}
      </div>
      <div class="network-picker__label-symbol">
        ({{network.currencyName}}) 
      </div>
      <switch-arrow />
    </div>
  </div>
</template>

<script setup lang="ts">

import { PropType, ref } from "vue";
import { BaseNetwork } from "@/types/base-network";
import SwitchArrow from "@action/icons/header/switch_arrow.vue";
import AddNetwork from "@action/views/add-network/index.vue";

const addNetworkShow = ref(true);

const props =
  defineProps({
    network: {
      type: Object as PropType<BaseNetwork>,
      default: () => ({}),
    }
  });

const setActiveNetworks = async () => {
  
};

</script>

<style lang="less">
@import "~@action/styles/theme.less";

.network-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  font-size: 12px;
  font-weight: 500px;
  &__label {
    color: #eee;
    padding: 5px 10px 5px 10px;
    border: solid 1px #eee;
    border-radius: 99999px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &-symbol {
      padding-left: 5px;
    }
  }

}
</style>
