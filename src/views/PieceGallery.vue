<template>
  <div>
    <NavbarComponent></NavbarComponent>
    <div id="hero-section">
      <div id="header-text" class="has-text-centered">
        <h2 class="main-line">~</h2>
        <h1 class="cyber-text main-line">PIECE GALLERY</h1>
        <h3>
          Select your troops!<br />
          View the collection
        </h3>
      </div>
      <div id="gradient-overlay"></div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="carousel">
            <div class="carousel-container" ref="carouselContainer">
              <div
                v-for="piece in chessPieces"
                :key="piece.id"
                class="carousel-item"
              >
                <div class="card">
                  <div class="card-image">
                    <figure class="image">
                      <img
                        :src="getImageUrl(piece.portrait)"
                        :alt="piece.name"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="content is-text-centered">
                      <p><strong>{{ piece.name }}</strong></p>
                      <p>
                        <small>Set:</small>
                        <span
                          class="tag is-dark"
                          :style="`background-color: ${piece.collectionColor}`"
                          >{{ piece.collection }}</span
                        >
                        <br />
                        <small>Rep:</small>
                        <span><i class="fa" :class="piece.class"></i></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-overlay"></div>
            <button
              class="button carousel-control carousel-prev"
              @click="prevSlide"
              v-if="carouselOffset > 0"
            >
              &lt;
            </button>
            <button
              class="button carousel-control carousel-next"
              @click="nextSlide"
              v-if="carouselOffset < chessPieces.length - 1"
            >
              &gt;
            </button>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="piece-description">
            <h4 class="piece-name is-text-centered">
              {{ chessPieces[carouselOffset].name }}
            </h4>
            <br />
            {{ chessPieces[carouselOffset].description }}
          </div>
        </div>
      </div>
    </div>
    <div id="ft">
      <FooterComponent></FooterComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/common/NavbarComponent.vue";
import FooterComponent from "@/components/common/FooterComponent.vue";
import { onMounted, ref } from "vue";
import { getImageUrl } from "@/shared";
import chessCollection from "@/assets/chess/bothsCollection/manifest.json";

const carouselContainer = ref();
const carouselOffset = ref(0);
const chessPieces = ref([...chessCollection]);

onMounted(() => {
  const carouselTransform = new DOMMatrix(
    window.getComputedStyle(carouselContainer.value).transform
  );
  const carouselItem =
    carouselContainer.value?.getElementsByClassName("carousel-item")[0];
  carouselTransform.e = -carouselItem?.clientWidth * 2;
  carouselContainer.value.style.transform = carouselTransform.toString();
});

function nextSlide() {
  if (carouselOffset.value < chessPieces.value.length - 1) {
    const carouselTransform = new DOMMatrix(
      window.getComputedStyle(carouselContainer.value).transform
    );
    const carouselItem =
      carouselContainer.value?.getElementsByClassName("carousel-item")[0];
    carouselTransform.e -= carouselItem?.clientWidth;
    carouselContainer.value.style.transform = carouselTransform.toString();
    carouselOffset.value++;
  }
}

function prevSlide() {
  if (carouselOffset.value > 0) {
    const carouselTransform = new DOMMatrix(
      window.getComputedStyle(carouselContainer.value).transform
    );
    const carouselItem =
      carouselContainer.value?.getElementsByClassName("carousel-item")[0];
    carouselTransform.e += carouselItem?.clientWidth;
    carouselContainer.value.style.transform = carouselTransform.toString();
    carouselOffset.value--;
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/_variables.scss";

.container {
  padding: 1rem;
}

#hero-section {
  height: 95vh;
  width: 100vw;
  background-image: url("/images/chessPieceBattlefield.jpg");
  background-size: cover;
  margin: 0;

  overflow: hidden;

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

  h3 {
    color: $white-ui;
  }

  #gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: inherit;
    width: 200%;
    background: #140213;
    opacity: 0.9;
    margin: 0;
    padding: 0;
  }
}

.card {
  border-radius: 20px;
  background: $midnight-black-ui;
  box-shadow: 0 0 5px 1px $charcoal-gray-ui;
  transition: box-shadow 0.1s ease-in-out;
  &:hover {
    box-shadow: 0 0 10px 3px $charcoal-gray-ui;
  }
}

.card-content {
  * {
    color: $bright-gray-ui;
  }
  p {
    margin: 0;
  }
  small {
    padding-right: 0.4rem;
  }
}
.carousel {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.carousel-container {
  display: flex;
  flex-direction: row;
  padding: 2rem;
  max-height: 95vh;
  position: relative;
  top: 0;
  left: 100%;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    #1c1c21 5%,
    #0000 25%,
    #0000 50%,
    #0000 75%,
    #1c1c21 100%
  );
  opacity: 0.9;
  width: 100%;
  height: 100%;
}

.carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  max-height: 95vh;
}

.carousel-item .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(95vh - 2rem);
  margin: 0 1rem;
  padding: 1rem;
}

figure.image {
  height: 50vh;
}
figure.image img {
  width: auto;
  height: 100%;
}
.carousel-control {
  background-color: transparent;
  color: $white-ui;
  border-radius: 101010px;
  padding: 1rem;
  position: absolute;
  top: 50%;
  transition: border 0.2s ease-in;

  &:active,
  &:focus {
    border: none;
  }
  &.carousel-next {
    right: 10%;
  }
  &.carousel-prev {
    left: 10%;
  }
}

.carousel-description {
  position: absolute;
  bottom: 0;
  height: 18vh;
  background-color: $dark-charcoal-ui;
  text-align: center;
}

.piece-description {
  background-color: #f5deb3; /* Wheat color */
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Box shadow for a slight depth effect */
  color: $dark-charcoal-ui;
  height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;

  font-family: "MedievalSharp", cursive;
  font-weight: 400;
  font-style: normal;
  border-radius: 20px;
}

.piece-name {
  font-size: larger;
  font-weight: bolder;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  text-decoration: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: -0.1rem;
    left: 0;
    width: 0;
    height: 2px;
    background-color: $dark-charcoal-ui;
    transition: width 0.4s ease-in-out;
  }
  &::after {
    bottom: -0.5rem;
    height: 1px;
  }

  &::before {
    left: 25%;
    width: 50%;
  }

  &::after {
    left: 30%;
    width: 40%;
  }
}

span.x-large {
  font-size: x-large;
}

.is-text-centered {
  text-align: center;
  align-items: center;
}
</style>
