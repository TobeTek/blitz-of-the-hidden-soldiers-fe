import { useToast } from "vue-toastification";

const toast = useToast();

export const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      // Check if the clicked element is neither the element
      // to which the directive is applied nor its child
      if (!(el === event.target || el.contains(event.target))) {
        // Invoke the provided method
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // Remove the event listener when the bound element is unmounted
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

export const copyToClipboard = {
  beforeMount(el: any, binding: any) {
    el.addEventListener("click", () => {
      navigator.clipboard
        .writeText(binding.value)
        .then(() => {
          const maxLen = 5;
          let preview = binding.value.toString();
          preview =
            preview.length <= maxLen
              ? preview
              : preview.substring(0, maxLen) + "...";
          toast(`Copied to clipboard: ${preview}`);
        })
        .catch((err) => {
          toast.error("Failed to copy: ", err.message);
        });
    });
  },
};
