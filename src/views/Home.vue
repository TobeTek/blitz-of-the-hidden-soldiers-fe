<template>
  <NavbarComponent></NavbarComponent>
  <div id="hero-section">
    <div id="header-text" class="has-text-centered">
      <h1 data-value="BLITZ" class="cyber-text main-line">BLITZ</h1>
      <h2 class="main-line">OF THE</h2>
      <h1 data-value="HIDDEN SOLDIERS" class="cyber-text main-line">
        HIDDEN SOLDIERS
      </h1>
    </div>
    <div id="curves">
      <div class="curve-1"></div>
      <div class="curve-2"></div>
      <div class="curve-3"></div>
    </div>
    <div id="gradient-overlay"></div>
  </div>
  <div id="description" class="has-text-centered">
    <h1>Prepare for Battle!</h1>
    <div class="preview-content">
      <p>
        <b>BoTHS</b> is an adaptation of the chess variant,
        <a href="https://en.wikipedia.org/wiki/Dark_chess">Dark Chess</a>. In
        Dark Chess, players can only view the squares their pieces are
        "attacking". Pieces suddenly appear from the shadows, as you and your
        opponent duel.
      </p>
      <p>
        In an interesting interplay between cryptography and strategy games,
        create and command your own unique army with warriors from around the globe &ndash;
        perhaps Alexander the Great might lead your army!.
      </p>
      <hr />
      <h3>
        Play a game of incomplete information on a trustless public blockchain.
        Lead your troops to victory!
      </h3>
    </div>
  </div>
  <div id="ft">
    <FooterComponent></FooterComponent>
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/common/NavbarComponent.vue";
import FooterComponent from "@/components/common/FooterComponent.vue";
import { onMounted } from "vue";

onMounted(() => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let interval: any = undefined;

  const $targets = Array.from(document.getElementsByClassName("cyber-text"));

  $targets.forEach(($target) => {
    $target.onmouseover = (event: Event) => {
      let iteration = 0;

      clearInterval(interval);

      interval = setInterval(() => {
        event.target.innerText = event.target?.innerText
          .split("")
          .map((letter: string, index: number) => {
            if (index < iteration) {
              return event.target.dataset.value[index];
            }

            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iteration >= event.target?.dataset?.value.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    };
  });
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

body {
  z-index: 5;
}

#hero-section {
  height: 95vh;
  width: 100vw;
  background-image: url("/images/chessPieceMysticalBg.png");
  background-size: cover;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  #header-text {
    z-index: 10;
  }

  .main-line {
    color: $white-ui;
    font-weight: bolder;
  }

  h1 {
    height: fit-content;
    font-size: 4rem;
    padding: 0;
  }
  h2 {
    height: fit-content;
    font-size: 2rem;
    padding: 0;
  }

  #gradient-overlay {
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #05010d, #9017efaa, #05010d);
    opacity: 0.02;
    top: 300px;
    border-radius: 100% 100% 0 0;
    margin: 0 auto;
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1440px) {
  /* Curves */
  #curves {
    margin: 0 auto;
    position: absolute;
    bottom: clamp(20px, 20%, 60px);
    width: 100vw;

    .curve-1 {
      position: absolute;
      top: 0px;
      background-color: #05010d;
      border-radius: 150% 150% 0 0;
      background: linear-gradient(90deg, #05010d, #9017ef, #05010d);
      padding-bottom: 400px;
      z-index: 1;
      height: 100px;
      width: 90%;
      margin-left: 5%;
      margin-right: 5%;
      align-items: center;
      justify-items: center;
    }

    .curve-2 {
      position: absolute;
      top: 5px;
      background-color: #05010d;
      border-radius: 180% 180% 0 0;
      background: linear-gradient(90deg, #060110, 05010D, #060110);
      padding-bottom: 400px;
      z-index: 2;
      height: 100px;
      width: 92%;
      margin-left: 4%;
      margin-right: 4%;
      align-items: center;
      justify-items: center;
    }
    .curve-3 {
      position: absolute;
      top: 50px;
      background-color: #05010d;
      border-radius: 100% 100% 0 0;
      padding-bottom: 180px;
      z-index: 3;
      height: 200px;
      width: 95%;
    }
  }
}

#description {
  position: relative;
  margin: 10%;
  z-index: 10;
  color: $white-ui;

  h1 {
    font-size: 2rem;
    font-weight: bolder;
    padding-bottom: 2rem;
  }
}

h3{
  font-size: large;
}
</style>
