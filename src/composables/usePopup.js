import { ref } from "vue";

export function usePopup() {
  const show = ref(false);

  const toggle = () => {
    show.value = !show.value;
  };

  const close = () => {
    show.value = false;
  };

  const open = () => {
    show.value = true;
  };

  return {
    show,
    open,
    close,
    toggle,
  };
}
