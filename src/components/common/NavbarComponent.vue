<template>
  <nav
    id="navbar"
    class="navbar is-dark"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link to="/"
        ><img alt="BoTHS Logo" src="@/assets/bothsLogo.svg"
      /></router-link>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <a class="navbar-item underline-link"> Home </a>

      <a class="navbar-item underline-link"> Documentation </a>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/me" tag="button" class="button glow-button" id="play-game">
              <strong>Play Game</strong>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
onMounted(() => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

#play-game {
  background: #680b11;
  background: linear-gradient(
    94deg,
    $light-purple-ui 0.64%,
    $deep-plum-ui 53.38%,
    $dark-burgundy-ui 95.45%
  );
  padding: 1rem 2rem;
  border-radius: 5px;

  border: 0.5px solid $charcoal-gray-ui;
  overflow: hidden;
  color: $bright-gray-ui;

  transition: color 0.2s ease-in-out;

  &:hover{
    color: $white-ui;
  }
}

#navbar {
  position: absolute;
  top: 5%;
  left: 10%;
  // margin: 1rem auto;
  padding: 1rem;
  background: transparent;
  border: 2px solid $muted-charcoal-ui;
  border-radius: 20px;
  width: 80%;

  .navbar-menu {
    background: inherit;
  }

  .navbar-item.underline-link {
    margin-left: 10%;
    height: fit-content;
    line-height: unset;
    background: inherit;
    font-size: large;

    .navbar-item:hover {
      background: inherit;
    }
  }
}

.game-text {
  border-radius: 20px;
  background: linear-gradient(
    94deg,
    #9017ef 0.64%,
    #700d6a 53.38%,
    #680b11 95.45%
  );
  border: 0.5px solid #fff;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.game-text p {
  padding-left: 40px;
  padding-right: 40px;
  font-size: 24px;
  color: #fff;
  text-align: center;
  font-family: "DM Mono";
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  align-items: center;
}

.btn {
  padding: 0px;
  align-items: center;
}

a {
  color: white;
  text-decoration: none;
}

// .un {
//   display: inline-block;
//   padding-bottom: 2px;
//   background-image: linear-gradient(#fff 0 0);
//   background-position: 0 100%;
//   background-size: 0% 2px;
//   background-repeat: no-repeat;
//   transition: background-size 0.3s, background-position 0s 0.3s;
//   color: #fff;
//   text-align: center;
//   font-family: "DM Mono";
//   font-size: 22px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: normal;
// }

// .un:hover {
//   background-position: 100% 100%;
//   background-size: 100% 2px;
// }
</style>
