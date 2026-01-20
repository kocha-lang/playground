import { debounce } from "@/utils";
import { buildMessage } from "@/utils";
import { ref } from "vue";

export function useKochaWorker() {
  const logs = ref([]);
  const worker = new Worker(
    new URL("../workers/kocha.worker.js", import.meta.url),
    { type: "module" },
  );

  const shouldClearOnEveryRun = ref(true)

  const executeCode = (code) => {
    if (logs.value.length) {
      logs.value.push({ type: "output", value: "\n" });
    }

    if(shouldClearOnEveryRun.value) {
      clearLogs();
    }

    worker.postMessage(buildMessage("run", code));
  };

  const debouncedExecution = debounce(executeCode, 500);

  const clearLogs = () => {
    logs.value = [];
  };

  worker.onerror = (event) => {
    console.warn(event);
  };

  worker.onmessage = (event) => {
    const message = event.data;

    if (message.name == "prompt") {
      const response = window.prompt(message.payload);
      worker.postMessage(buildMessage("prompt-response", response));
      return;
    }

    if (message.name == "output") {
      const logObject = {
        type: message.name,
        value: message.payload?.join("\n"),
      };
      logs.value.push(logObject);
      return;
    }

    if (message.name == "error") {
      const logObject = { type: message.name, value: message.payload };
      logs.value.push(logObject);
      return;
    }
  };

  return {
    logs,
    debouncedExecution,
    executeCode,
    clearLogs,
    shouldClearOnEveryRun,
  };
}
