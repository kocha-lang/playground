<template>
  <label class="toggle">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function onChange(event) {
  emit('update:modelValue', event.target.checked)
}
</script>

<style scoped>
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  border-radius: 999px;
  transition: 0.2s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

input:checked + .slider {
  background-color: #42b883;
}

input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
