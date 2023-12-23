<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
    <router-link to="/play-game">Play Game</router-link>
  </nav> -->
  <main class="full-width">
    <router-view />
  </main>

</template>

<script setup lang="ts">
import { ComputedGetter } from "vue";
// import {} from "vuetify";
// const isDesktop = this.$vuetify.breakpoint.mdAndUp;
function isMobile() {
  return screen.width < 750;
}
</script>

<style lang="scss">
@import "assets/styles/_variables.scss";
@import "assets/styles/_base.scss";
@import "assets/styles/main.scss";
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css");

html {
  background-color: $midnight-blue-ui;
  color: $white-ui;
  margin: 0;
  padding: 0;
}

.full-width {
  width: 100vw;
}
</style>
