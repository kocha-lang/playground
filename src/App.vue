<script setup>
import { onMounted, ref, watch } from "vue";
import { CodeEditor } from "monaco-editor-vue3";
import { useKochaSyntax } from "./composables/useKochaSyntax";
import { useKochaWorker } from "./composables/useKochaWorker";
import PlayIcon from "./components/PlayIcon.vue";
import ClearIcon from "./components/ClearIcon.vue";
import ShareIcon from "./components/ShareIcon.vue";
import { decodeCode, encodeCode } from "./utils";
import { usePopup } from "./composables/usePopup";

const code = ref("");

const syntax = useKochaSyntax();
const { executeCode, logs, clearLogs } = useKochaWorker();

const {
  showSharePopover,
  handleCopy,
  toggleSharePopover,
  closeSharePopover,
  popOverCopyText,
} = usePopup();

const editorOptions = {
  fontSize: 18,
  minimap: { enabled: false },
  automaticLayout: true,
  tabSize: 2,
};

const clearCode = () => {
  code.value = "";
};

watch(code, (value) => {
  const encoded = encodeCode(value);
  location.hash = `code=${encoded}`;
});

onMounted(() => {
  const params = new URLSearchParams(location.hash.slice(1));
  const encoded = params.get("code");
  if (encoded) code.value = decodeCode(encoded);
});
</script>

<template>
  <div class="page">
    <nav class="navigation">
      <h1 class="title">
        <a href="https://kocha-lang.uz"> Kocha Lang<sup>1.2.0</sup> </a>
      </h1>

      <button class="btn btn-run" title="Run code" @click="executeCode(code)">
        <PlayIcon />
      </button>
    </nav>

    <div
      v-if="showSharePopover"
      class="popover-backdrop"
      @click.self="closeSharePopover"
    >
      <div class="popover">
        <h3>Share this code</h3>

        <p>
          Just send the URL to your friends.
          <br />
          The code is saved in the link and will work instantly.
        </p>

        <div class="popover-footer">
          <button class="btn btn-close" @click="closeSharePopover">
            Close
          </button>
          <button class="btn btn-run" @click="handleCopy">
            {{ popOverCopyText }}
          </button>
        </div>
      </div>
    </div>

    <main class="layout">
      <section class="editor">
        <div class="header">
          Code

          <div class="actions">
            <button
              class="btn btn-close"
              title="Share"
              @click="toggleSharePopover"
            >
              <ShareIcon />
            </button>

            <button class="btn btn-close" title="Clear code" @click="clearCode">
              <ClearIcon />
            </button>
          </div>
        </div>
        <CodeEditor
          v-model:value="code"
          :language="syntax.languageId"
          :theme="syntax.theme || 'vs-dark'"
          :options="editorOptions"
        />
      </section>

      <section class="output">
        <div class="header">
          Output

          <button
            class="btn btn-close"
            title="Clear outputs"
            @click="clearLogs"
          >
            <ClearIcon />
          </button>
        </div>
        <div class="logs custom-scroll">
          <pre
            v-for="(log, i) in logs"
            :key="i"
            :class="{ error: log.type === 'error' }"
            >{{ log.value }}</pre
          >
        </div>
      </section>
    </main>

    <footer>
      Kocha Lang. MIT.
      <a href="https://github.com/kocha-lang/kocha">Github</a>
    </footer>
  </div>
</template>

<style scoped>
.page {
  height: 100svh;
  display: flex;
  flex-direction: column;
  background: #0b1020;
  color: #e5e7eb;
}

footer {
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: xx-small;
  color: dimgrey;
  padding-bottom: 8px;
  gap: 4px;
}

.navigation {
  height: 64px;
  padding: 0 24px;
  padding-top: 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  /* justify-content: space-between; */
}

.title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
}

.title a {
  color: unset;
}

.title sub,
.title sup {
  font-size: 12px;
}

.btn {
  padding: 8px 18px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-run {
  background-color: rgb(0, 151, 0);
  color: #ffffff;
}

.btn-close {
  background-color: transparent;
  border: solid 1px #464646;
  color: #ffffff;
}

.btn-close:hover {
  background-color: #282c34;
}

.layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.editor,
.output {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #282c34;
  overflow: hidden;
}

.header {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: #1f2634;
  border-bottom: 1px solid #1e293b;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.output {
  min-width: 0;
  min-height: 200px;
}

.logs {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 15px;
}

pre {
  margin: 0 0 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

.error {
  color: #f87171;
}

.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #020617;
}

.custom-scroll::-webkit-scrollbar {
  width: 10px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #020617, #020617);
  border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6366f1, #38bdf8);
  border-radius: 8px;
  border: 2px solid #020617;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #818cf8, #60a5fa);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.popover-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popover {
  background: #1f2634;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px 24px;
  width: 320px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.popover h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.popover p {
  font-size: 14px;
  color: #cbd5f5;
  margin-bottom: 16px;
}

.popover-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .output {
    max-height: 40svh;
  }
}
</style>
