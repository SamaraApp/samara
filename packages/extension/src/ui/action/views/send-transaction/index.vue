<template>
  <component v-bind="$props" :is="layout" />
</template>

<script setup lang="ts">
import SendTransactionRVM from "@/providers/radiant/ui/send-transaction/index.vue";
import { useRoute } from "vue-router";
import { ProviderName } from "@/types/provider";
import { getNetworkByName } from "@/libs/utils/networks";
import { shallowRef } from "vue";

const sendLayouts: Record<ProviderName, any> = {
  [ProviderName.radiant]: SendTransactionRVM,
  [ProviderName.samara]: null,
};
const layout = shallowRef();
const route = useRoute();
const networkName: string = route.params.id as string;
const network = getNetworkByName(networkName);
if (network) {
  layout.value = sendLayouts[network.provider];
}
</script>
