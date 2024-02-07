import About from "@/views/About.vue";
import Home from "@/views/Home.vue";
import GameOverview from "@/views/GameOverview.vue";
import PlayGame from "@/views/PlayGame.vue";
import { createRouter, createWebHistory } from "vue-router";
import PieceGallery from "@/views/PieceGallery.vue";
import NotFound404 from "@/views/NotFound404.vue";

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
    path: "/play-game/:gameAddress",
    name: "PlayGame",
    component: PlayGame,
  },
  {
    path: "/gallery",
    name: "PieceGallery",
    component: PieceGallery,
  },
  {
    path: "/:pathMatch(.*)",
    name: "NotFound404",
    component: NotFound404,
  }
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
