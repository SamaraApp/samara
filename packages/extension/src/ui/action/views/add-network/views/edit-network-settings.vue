<template>
  <div>
    <div
      class="add-network__header"
      :class="{ border: isHasScroll() && scrollProgress > 0 }"
    >
      <h3>Edit Network Settings</h3>
      <a class="add-network__close" @click="close">
        <close-icon />
      </a>
    </div>

    <custom-scrollbar
      ref="manageNetworkScrollRef"
      class="add-network__scroll-area"
      :settings="scrollSettings({ suppressScrollX: true })"
      @ps-scroll-y="handleScroll"
    >
      <app-menu
        :networks="networks"
        :selected="(route.params.id as string)"
        :search-input="searchInput"
        @update:order="(e) => emit('update:order', e)"
        @update:network="(e) => emit('update:network', e)"
      />
    </custom-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, ComponentPublicInstance, PropType } from "vue";
import CloseIcon from "@action/icons/common/close-icon.vue";
import AddNetworkSearch from "../components/add-network-search.vue";
import AddNetworkItem from "../components/add-network-item.vue";
import CustomScrollbar from "@action/components/custom-scrollbar/index.vue";
import { NodeType } from "@/types/provider";
import { getAllNetworks, POPULAR_NAMES } from "@/libs/utils/networks";
import NetworksState from "@/libs/networks-state";
import scrollSettings from "@/libs/utils/scroll-settings";
import { computed } from "@vue/reactivity";
import AppMenu from "@action/components/app-menu/index.vue";
import { useRouter, useRoute } from "vue-router";
import { NetworkItem } from "@action/types/network";
import { BaseNetwork } from "@/types/base-network";

const route = useRoute();
interface NodeTypesWithActive extends NodeType {
  isActive: boolean;
}
 
const emit = defineEmits<{
  (e: "activeNetworks"): void;
  (e: "update:network", network: BaseNetwork): void;
  (e: "update:order", networks: BaseNetwork[]): void;
}>();
 
const networksState = new NetworksState();
const searchInput = ref("");
const all = ref<Array<NodeTypesWithActive>>([]);
const popular = ref<Array<NodeTypesWithActive>>([]);
const scrollProgress = ref(0);
const manageNetworkScrollRef = ref<ComponentPublicInstance<HTMLElement>>();
const showTestNets = ref(false);

defineExpose({ manageNetworkScrollRef });

defineProps({
  networks: {
    type: Array as PropType<Array<NetworkItem>>,
    default: () => [],
  },
  close: {
    type: Function as PropType<() => void>,
    default: () => ({}),
  },
  toCustom: {
    type: Function as PropType<() => void>,
    default: () => ({}),
  },
  selected: {
    type: String,
    default: "",
  },
});

const getAllNetworksAndStatus = async () => {
  const activeNetworks = await networksState.getActiveNetworkNames();

  console.log("activeNetworks", activeNetworks);
  const allNetworks = getAllNetworks().map((net) => {
    console.log("allNetworks", allNetworks);
    return {
      ...net,
      isActive: activeNetworks.includes(net.name),
    };
  });

  return allNetworks;
};

const searchAllNetworks = computed(() => {
  return all.value.filter((a) =>
    a.name_long.toLowerCase().startsWith(searchInput.value.toLowerCase())
  );
});
onBeforeMount(async () => {
  /*const allNetworksNotTestNets = (await getAllNetworksAndStatus()).filter(
    ({ isTestNetwork }) => !isTestNetwork
  );*/

  const allNetworksNotTestNets = (await getAllNetworksAndStatus());

  console.log("allNetworksNotTestNets", allNetworksNotTestNets, POPULAR_NAMES);

  console.log("POPULAR_NAMES", POPULAR_NAMES, );

  const popularNetworks = allNetworksNotTestNets.filter((net) =>
    POPULAR_NAMES.includes(net.name)
  );

  all.value = allNetworksNotTestNets;
  popular.value = popularNetworks;
});

const onTestNetCheck = async () => {
  showTestNets.value = !showTestNets.value;

  if (showTestNets.value) {
    all.value = await getAllNetworksAndStatus();
  } else {
    all.value = all.value.filter(({ isTestNetwork }) => !isTestNetwork);
  }
};

const onToggle = async (networkName: string, isActive: boolean) => {
  try {
    await networksState.setNetworkStatus(networkName, isActive);
    emit("update:activeNetworks");
    all.value = all.value.map((network) => {
      if (network.name === networkName) {
        network.isActive = isActive;
      }

      return network;
    });

    popular.value = all.value.filter(({ name }) =>
      POPULAR_NAMES.includes(name)
    );
  } catch (e) {
    console.error(e);
  }
};

const updateSearch = (value: string) => {
  searchInput.value = value;
};
const handleScroll = (e: any) => {
  const progress = Number(e.target.lastChild.style.top.replace("px", ""));
  scrollProgress.value = progress;
};
const isHasScroll = () => {
  if (manageNetworkScrollRef.value) {
    return manageNetworkScrollRef.value.$el.classList.contains("ps--active-y");
  }

  return false;
};
</script>

<style lang="less" scoped>
@import "~@action/styles/theme.less";
@import "~@action/styles/custom-scroll.less";

.add-network {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background-color: #222222;
  &__header {
    width: 100%;
    background: #222222;
    box-sizing: border-box;
    padding: 24px 72px 12px 32px;
    position: relative;
    z-index: 4;

    h3 {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      margin: 0;
      color: @primaryLabel;
    }

    &.border {
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05),
        0px 0px 1px rgba(0, 0, 0, 0.25);
      padding: 14px 72px 12px 32px;

      h3 {
        font-size: 20px;
        line-height: 28px;
      }
    }
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0;
    transition: background 300ms ease-in-out;

    &:hover {
      background: @black007;
    }
  }

  &__list {
    &-header {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      color: @primaryLabel;
      margin: 8px 0 0 0;
    }
  }

  &__scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    max-height: 500px;
    margin: 0;
    padding: 0 32px !important;
    box-sizing: border-box;

    &.ps--active-y {
      padding-right: 0;
    }
  }
}
</style>
