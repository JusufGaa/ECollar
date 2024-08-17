<script setup lang="ts">
import { usePrefixCls } from "../composables/useUtils";

interface ButtonProps {
  disabled?: boolean;
}
withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
});

const emits = defineEmits(["click"]);
</script>

<template>
  <Button
    danger
    :prefix-cls="usePrefixCls('btn')"
    :disabled="disabled"
    @click="emits('click')"
  >
    <template #icon><SearchOutlined /></template>
    <slot></slot>
  </Button>
</template>

<style lang="less"></style>
