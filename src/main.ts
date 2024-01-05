import App from "@/App.vue";
import router from "@/router";
import { clickOutside } from "./directives";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { PluginOptions } from "vue-toastification";
import "tsconfig-paths";
import "vue-toastification/dist/index.css";
import { VueFire, VueFireAuth } from 'vuefire'

window.Buffer = window.Buffer || require("buffer").Buffer; 

import firebaseApp from "@/firebaseInit";


let app = createApp(App).use(router);

// Vue Fire
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
})

// Toasts
const toastOptions: PluginOptions = {
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true,
  hideProgressBar: true,
};
app.use(Toast, toastOptions);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Directives
app.directive(
  'click-outside',
  clickOutside
)

app.mount("#app");

