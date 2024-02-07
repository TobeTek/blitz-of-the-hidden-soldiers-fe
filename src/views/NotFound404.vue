<template>
  <div class="not-found">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="title">404</h1>
          <h2 class="subtitle">Not Found</h2>
          <p>Sorry, the page you are looking for does not exist.</p>
          <hr />
          <span
            >>>>
            <RouterLink to="/" class="underline-link">Go Home</RouterLink></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";
.title {
  color: $bright-gray-ui;
}
.subtitle {
  text-transform: uppercase;
}
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

hr {
  margin: 2rem 0;
}
</style>
