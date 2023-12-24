<template>
  <main class="full-width">
    <router-view />
  </main>
</template>

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
