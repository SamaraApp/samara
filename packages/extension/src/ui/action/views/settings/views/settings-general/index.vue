<template>
  <div>
    <settings-inner-header v-bind="$attrs" :is-general="true" />
    <!-- <base-select
      :select="selecCurrency"
      title="Currency"
      :value="currency"
      :list="currencyList"
    ></base-select> -->

    <settings-switch
      title="Turn off Samara for 1 hour"
      :is-checked="isRadiantDisabled"
      @update:check="toggleRadiantDisable"
    />
    <div class="settings__label">
      <p>
        Pause Samara interactions with Radiant DApps if you are using other
        extensions
      </p>
    </div>
 
    <base-select
      :select="selecTimer"
      title="Auto-lock timer"
      :value="timer"
      :list="timerList"
    ></base-select> 

    <div class="settings__label">
      <p>Set the idle time in minutes before Samara will become locked.</p>
    </div>  
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SettingsInnerHeader from "@action/views/settings/components/settings-inner-header.vue";
// import BaseSelect from "@action/components/base-select/index.vue";
import SettingsSwitch from "@action/views/settings/components/settings-switch.vue";
import SettingsState from "@/libs/settings-state";
import { SettingsType } from "@/libs/settings-state/types";

const settingsState = new SettingsState();
const isRadiantDisabled = ref(false);
onMounted(async () => {
  const allSettings: SettingsType = await settingsState.getAllSettings();
  console.log("allSettings", allSettings);
  isRadiantDisabled.value = allSettings.rvm.inject.disabled;
});
const toggleRadiantDisable = async (isChecked: boolean) => {
  const evmSettings = await settingsState.getRVMSettings();
  evmSettings.inject = {
    disabled: isChecked,
    timestamp: new Date().getTime(),
  };
  await settingsState.setRVMSettings(evmSettings);
};
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.settings {
  &__label {
    padding: 0 48px;
    margin-bottom: 10px;
    p {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.5px;
      color: @secondaryLabel;
      margin: 0;
    }
  }

  &__wrap {
    .base-select__container {
      margin-bottom: 12px;
    }
  }
}
</style>
