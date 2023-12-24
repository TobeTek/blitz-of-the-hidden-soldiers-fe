import About from "@/views/About.vue";
import Home from "@/views/Home.vue";
import GameOverview from "@/views/GameOverview.vue";
import PlayGame from "@/views/PlayGame.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/me",
    name: "GameOverview",
    component: GameOverview,
  },
  {
    path: "/play-game",
    name: "PlayGame",
    component: PlayGame,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
