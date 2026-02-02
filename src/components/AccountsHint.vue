<template>
  <section class="hint">
    <span class="hint__icon">?</span>
    <p>
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </p>
  </section>
</template>

<style scoped>
.hint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #eef4fa;
  color: #1f2a33;
  border: 1px solid #d7e1ee;
  font-size: 0.95rem;
}

.hint__icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #8a9aac;
  color: #4a5b6a;
  display: grid;
  place-items: center;
  font-weight: 600;
}
</style>
