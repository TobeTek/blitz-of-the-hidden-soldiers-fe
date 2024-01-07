import App from "@/App.vue";
import router from "@/router";
import { clickOutside } from "./directives";
import { createApp } from "vue";
import { createPinia, Store } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { PluginOptions } from "vue-toastification";
import "tsconfig-paths";
import "vue-toastification/dist/index.css";
import { VueFire, VueFireAuth } from "vuefire";
import localForage from "localforage";
import firebaseApp from "@/firebaseInit";

localForage.config({
  driver: localForage.INDEXEDDB,
});

async function indexDbPlugin({
  options,
  store,
}: {
  options: any;
  store: Store;
}) {
  console.log(options.$persistIndexDB, store.$state.pieceMotionZkey);
  if (options.$persistIndexDB) {
    for (const storeField of options.$persistIndexDB) {
      const stored = await localForage.getItem(
        store.$id + `-${storeField}-state`
      );
      console.log(store.$state[storeField]);
      if (stored) {
        store.$state[storeField] = stored;
      }
      console.log("Patched successfully: ", stored);
      store.$subscribe(() => {
        if (
          store.$state[storeField] === undefined ||
          store.$state[storeField] === null
        )
          {return};
        localForage.setItem(
          store.$id + `-${storeField}-state`,
          store.$state[storeField]
        );
      });
    }
  }
}

let app = createApp(App).use(router);

// Vue Fire
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

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
pinia.use(indexDbPlugin);
// pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Directives
app.directive("click-outside", clickOutside);

app.mount("#app");
