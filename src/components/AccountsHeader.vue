<script setup lang="ts">
const emit = defineEmits<{
  (event: 'add'): void
}>()
</script>

<template>
  <header class="header">
    <h1 class="title">Учетные записи</h1>
    <button
      class="add-btn"
      type="button"
      aria-label="Добавить учетную запись"
      @click="emit('add')"
    >
      +
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1f2a33;
}

.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #cdd6e0;
  background: #fff;
  color: #3a4a57;
  font-size: 1.5rem;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.add-btn:hover {
  border-color: #94a3b3;
  box-shadow: 0 0 0 3px rgba(148, 163, 179, 0.2);
}
</style>
