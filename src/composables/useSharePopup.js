import { debounce } from "@/utils";
import { ref } from "vue";

export function useSharePopup() {
  const popOverCopyText = ref("Copy");
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
    handleCopy,
    popOverCopyText,
  };
}
