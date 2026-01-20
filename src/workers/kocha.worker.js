import { runCode } from "@/lib/kocha";
import { buildMessage } from "@/utils";

let promptResolver;

self.prompt = (message) => {
  return new Promise((resolve) => {
    promptResolver = resolve;
    self.postMessage(buildMessage("prompt", message));
  });
};

console.log = (...args) => postMessage(buildMessage("output", args));

self.onunhandledrejection = (event) => {
  event.preventDefault();
  postMessage(buildMessage("error", event?.reason));
};

self.onerror = (error) => {
  postMessage(buildMessage("error", error));
  return true;
};

onmessage = (event) => {
  const message = event.data;

  switch (message.name) {
    case "run":
      runCode(message.payload);
      break;
    case "prompt-response":
      if (promptResolver) {
        promptResolver(message.payload);
        promptResolver = null;
      }
      break;
  }
};
