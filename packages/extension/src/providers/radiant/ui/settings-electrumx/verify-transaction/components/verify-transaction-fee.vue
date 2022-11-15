<template>
  <div class="verify-transaction-fee">
    <div class="verify-transaction-fee-wrapper">
      <p class="verify-transaction-fee-wrapper__fiat">
        Fee: ${{ $filters.formatFiatValue(fee.fiatValue).value }}
        {{ fee.fiatSymbol }}
      </p>
      <p class="verify-transaction-fee-wrapper__crypto">
        {{ $filters.formatFloatingPointValue(fee.nativeValue).value }}
        <span> {{ fee.nativeSymbol }}</span>
      </p>
    </div>
    <div class="verify-transaction-fee__time">
      <time-icon />
      <span>5 min</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { GasFeeInfo } from "../../../types";
import TimeIcon from "@action/icons/fee/time-icon.vue";

defineProps({
  fee: {
    type: Object as PropType<GasFeeInfo>,
    default: () => {
      return {};
    },
  },
});
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.verify-transaction-fee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .verify-transaction-fee-wrapper {
    width: 100%;
    padding: 10px 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;

    &__fiat {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @primaryLabel;
      margin: 0 8px 0 0;
    }

    &__crypto {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0;

      span {
        font-variant: small-caps;
      }
    }
  }

  &__time {
    color: @secondaryLabel;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-right: 15px;

    span {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: @primaryLabel;
      white-space: nowrap;
    }

    svg {
      margin-right: 4px;
    }
  }

}
</style>
