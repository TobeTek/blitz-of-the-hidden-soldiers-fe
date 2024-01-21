import App from "@/App.vue";
import router from "@/router";
import { clickOutside, copyToClipboard } from "./directives";
import { createApp } from "vue";
import { createPinia, Store } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Toast, { PluginOptions } from "vue-toastification";
import "tsconfig-paths";
import "vue-toastification/dist/index.css";
import { VueFire, VueFireAuth } from "vuefire";
import localForage from "localforage";
import firebaseApp from "@/firebaseInit";
import "./polyfills";

localForage.config({
  driver: localForage.INDEXEDDB,
});

const persistedState = {};

async function indexDbPlugin({
  options,
  store,
}: {
  options: any;
  store: Store;
}) {
  if (options.$persistIndexDB) {
    for (const storeField of options.$persistIndexDB) {
      const stored = await localForage.getItem(
        store.$id + `-${storeField}-state`
      );
      if (stored) {
        persistedState[storeField] = stored;
        store.$state[storeField] = stored;
      }
    }

    store.$subscribe(async (mutation, state) => {
      for (const storeField of options.$persistIndexDB) {
        if (state[storeField] === undefined || state[storeField] === null) {
          continue;
        }

        if (state[storeField] === persistedState[storeField]) {
          continue;
        }

        if (store.$state[storeField] instanceof File) {
          await localForage.setItem(
            store.$id + `-${storeField}-state`,
            store.$state[storeField]
          );
        } else {
          // Weird stuff. Occassionally a race condition makes an empty object to be passed.
        }
      }
    });
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
app.directive("click-to-copy-text", copyToClipboard);

app.mount("#app");
