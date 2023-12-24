<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot name="modal-content"> </slot>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close')"
    ></button>
  </div>
</template>

<script setup>
</script>
