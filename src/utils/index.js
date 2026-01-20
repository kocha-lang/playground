export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function captureLog(fn) {
  const logs = [];
  const originalLog = console.log;

  console.log = (...args) => logs.push(args.join(' '));
  fn();

  // restore original console
  console.log = originalLog;

  return logs;
}


export function buildMessage(name, payload) {
  return {
    name,
    payload
  }
}

export function encodeCode(code) {
  const json = JSON.stringify({ code })
  const uint8Array = new TextEncoder().encode(json)
  let binary = ''
  uint8Array.forEach(b => binary += String.fromCharCode(b))
  return btoa(binary)
}

export function decodeCode(encoded) {
  try {
    const binary = atob(encoded)
    const uint8Array = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      uint8Array[i] = binary.charCodeAt(i)
    }
    const json = new TextDecoder().decode(uint8Array)
    return JSON.parse(json).code ?? ''
  } catch {
    return ''
  }
}