import { ref } from "vue";

export function useInitializeStore(asyncSetup: CallableFunction) {
  const initialized = ref(false);
  const loading = ref(false);

  (async function () {
    loading.value = true;
    await asyncSetup();
    initialized.value = true;
    loading.value = false;
  })();

  return { initialized, loading };
}
