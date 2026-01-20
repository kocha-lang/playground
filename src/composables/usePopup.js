import { debounce } from "@/utils";
import { ref } from "vue";

export function usePopup() {
  const showSharePopover = ref(false);
  const popOverCopyText = ref("Copy");

  const toggleSharePopover = () => {
    showSharePopover.value = !showSharePopover.value;
  };

  const closeSharePopover = () => {
    showSharePopover.value = false;
  };

  const getCurrentURL = () => {
    return window.location?.href;
  };

  const resetCopyText = () => {
    popOverCopyText.value = "Copy";
  };

  const debouncedReset = debounce(resetCopyText, 5000);

  const handleCopy = () => {
    const url = getCurrentURL();
    navigator.clipboard.writeText(url);
    popOverCopyText.value = "Copied!";

    debouncedReset();
  };

  return {
    showSharePopover,
    handleCopy,
    toggleSharePopover,
    closeSharePopover,
    popOverCopyText,
  };
}
