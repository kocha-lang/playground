<script setup>
defineProps({
  show: {
    type: Boolean,
    requred: true
  },
  header: {
    type: String,
    requred: true
  },
  text: {
    type: String,
    requred: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="popover-backdrop" @click.self="emit('close')">

    <div class="popover">
      <h3>{{ header }}</h3>

      <slot>
        <p>{{ text }}</p>
      </slot>

      <div class="popover-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>