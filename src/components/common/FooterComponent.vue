<template>
  <div id="footer">
    <div class="columns is-mobile is-vcentered is-centered">
      <div class="column">
        <img src="@/assets/bothsLogo.svg" alt="" id="logo" />
      </div>
      <div class="column">
        <div class="footer-item">
          <a href="https://twitter.com/onambatech" class="">X.COM</a>
        </div>
        <div class="footer-item">
          <a href="https://discord.gg/umajFF99" class="">DISCORD</a>
        </div>
        <div class="footer-item">
          <a
            href="https://github.com/TobeTek/blitz-of-the-hidden-soldiers"
            class=""
            >GITHUB</a
          >
        </div>
      </div>
      <div class="column">
        <div class="footer-item">
          <router-link to="/me">PLAY GAME</router-link>
        </div>
        <div class="footer-item">
          <a href="https://boths.gitbook.io/blitz-of-the-hidden-soldiers-wiki/"
            >ABOUT</a
          >
        </div>
        <div class="footer-item">
          <a href="https://boths.gitbook.io/blitz-of-the-hidden-soldiers-wiki/"
            >WIKI</a
          >
        </div>
      </div>
    </div>
    <div id="attribution">
      Made with ♥ by <a href="https://onamba.tech">O'Namba</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

#footer {
  border-top: 1px solid $deep-plum-ui;
  font-size: larger;

  .columns {
    height: 20vh;
    padding: 10% 0;
  }
}

.footer-item {
  a {
    color: $dark-charcoal-ui;
    transition: color 0.3s ease-in-out;
  }
  a:hover {
    color: $bright-gray-ui;
  }
}

#logo {
  height: 6rem;
  margin: 0 20%;
}

#attribution {
  color: $white-ui;
  font-size: small;
  position: relative;
  bottom: 0;
  left: 0;
  text-align: center;
}
</style>
