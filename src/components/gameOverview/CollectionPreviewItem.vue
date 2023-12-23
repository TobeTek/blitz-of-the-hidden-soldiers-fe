<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <slot name="collection-image"></slot>
      </figure>
      <div class="card-overlay is-overlay is-hidden-mobile"></div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        <a class="underline-link">View on CollectiVerse</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.card {
  color: $white-ui;
  background: $dark-burgundy-ui;
  background: linear-gradient(
    32deg,
    $graphite-gray-ui,
    $midnight-black-ui,
    $dark-charcoal-ui
  );
}
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.card:hover .card-overlay {
  opacity: 0;
}

.card-image {
  z-index: 1;
}
.card-footer {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
  transition: transform 0.3s ease-in-out;
  transform: translateY(-100%); /* Initially translate the footer downward */
  z-index: 0;
}

.card:hover .card-footer {
  transform: translateY(100%); /* Slide the footer upward on hover */
}
</style>
