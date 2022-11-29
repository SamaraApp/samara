<template>
  <div class="network-header">
    <network-picker
      :network="network"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, PropType } from "vue";
import NetworkPicker from "./components/network-picker.vue";
import { useRouter } from "vue-router";
import { BaseNetwork } from "@/types/base-network";
const router = useRouter();
 

defineProps({
  network: {
    type: Object as PropType<BaseNetwork>,
    default: () => ({}),
  },
});

onMounted(async () => {
  router.beforeEach((to, from, next) => {
    //  showAccounts.value = false;
    next();
  });
});
 
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.network-header {
  position: fixed;
  width: 460px;
  height: 56px;
  //left: 340px;
  top: 56px;
  background: #222222;
  color: #eee;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25);
  z-index: 2;
 
}

</style>
