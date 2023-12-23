<!-- Spinner.vue -->
<template>
  <Transition>
    <div v-if="isLoading" class="spinner-container">
      <ClipLoader :color="color" :size="size" />
    </div>
  </Transition>
</template>

<script setup>
import ClipLoader from "vue-spinner/src/ClipLoader.vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true, // Make it mandatory for the parent to provide the prop
  },
  color: {
    type: String,
    default: "#fff",
  },
  size: {
    type: String,
    default: "35px", // Default size is 35 pixels
  },
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  background-color: $muted-charcoal-ui;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  z-index: 100;
  transition: transform 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(100%);
}
</style>
