<template>
  <div id="wrapper">
    <div class="image-container">
      <div
        class="overlay glow-button"
        :class="{ 'is-secondary': !isPrimary, 'is-primary': isPrimary }"
      >
        <div class="lead-text">
            <a href="" class="underline-link">{{ leadText }}
            </a>
        </div>
        <div class="description">{{ description }}</div>
      </div>
      <img src="@/assets/images/panels/chessPieces.jpg" alt="" class="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  leadText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

#wrapper {
  width: 100%;
  .image-container {
    position: relative;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure image covers the container */
    border-radius: 20px;
  }
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  padding-left: 20px;
  align-items: center;
  //   justify-content: center;
  
  color: $white-ui;
  overflow: hidden;
  
  font-size: x-large;

  @media (max-width: 768px) {
    body {
      font-size: large;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: medium;
    }
  }

  &.is-primary {
    background: $dark-charcoal-ui;
    background: linear-gradient(
      45deg,
      hex-with-alpha($deep-plum-ui, "cc"),
      hex-with-alpha($light-purple-ui, "cc")
    );
  }

  &.is-primary:hover {
    background: linear-gradient(
      45deg,
      hex-with-alpha($deep-plum-ui, "cc"),
      hex-with-alpha($light-purple-ui, "cc")
    );
  }

  &.is-secondary {
    background: $dark-charcoal-ui;
    background: linear-gradient(
      45deg,
      hex-with-alpha($dark-charcoal-ui, "cc"),
      #0a0a0aa7
    );
  }
}


</style>
