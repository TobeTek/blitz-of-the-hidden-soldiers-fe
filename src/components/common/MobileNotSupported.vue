<template>
  <div id="main" v-if="isMobile()">
    <div class="container has-text-centered block">
      <h1><b>Hold your horses!</b></h1>
      <h2>This site isn't ready for your steed yet.</h2>
      <p class="lead-text">
        We're still crafting this experience for larger screens, so please come
        back with your trusty desktop or laptop for the full adventure.
      </p>
      <hr>
      <router-link to="/" class="pb-3" >>>> Back to the homepage</router-link>
      <div>
        <img src="@/assets/bothsLogo.svg?inline" alt="BoTHS Logo" id="logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// XXX: Temporary change, revert for production
const isMobile = () => {
  // return screen.width <= 760;
  return false
};
console.log("isMobile: ", isMobile());
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.is-bold{
  font-weight: bold;
}
h1{
  font-size: x-large;
}

h2{
  font-size: large;
}

#main {
  position: fixed;
  top: 0;
  left: 0;
  background: $midnight-blue-ui;
  background: linear-gradient(65deg, $midnight-blue-ui, $midnight-black-ui);
  color: $white-ui;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  z-index: 200;
}

.container {
  padding: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  color: $muted-charcoal-ui;
  font-weight: bold;
  margin-bottom: 1rem;
}

.message {
  line-height: 1.5;
  animation: fade-in 1s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#logo {
  animation: pulse 5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

a:hover {
  text-decoration: none;
}
</style>
