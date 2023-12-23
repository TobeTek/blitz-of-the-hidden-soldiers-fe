import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import "tsconfig-paths";
import "vue-toastification/dist/index.css";
import Toast, { PluginOptions } from "vue-toastification";

const options: PluginOptions = {
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true,
  hideProgressBar: true,
};

let app = createApp(App).use(router).use(Toast, options);
app.mount("#app");

