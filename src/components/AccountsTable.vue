<script setup lang="ts">
import type { Account, AccountType, AccountLabel } from '../stores/accounts'

type FieldKey = 'labels' | 'type' | 'login' | 'password'

type InvalidFn = (id: string, field: FieldKey) => boolean

type ErrorMessageFn = (id: string, field: FieldKey) => string

const props = defineProps<{
  accounts: Account[]
  showPassword: Record<string, boolean>
  isInvalid: InvalidFn
  errorMessage: ErrorMessageFn
}>()

const emit = defineEmits<{
  (event: 'label-change', id: string, value: string): void
  (event: 'login-change', id: string, value: string): void
  (event: 'login-blur', id: string): void
  (event: 'password-change', id: string, value: string): void
  (event: 'password-blur', id: string): void
  (event: 'type-change', id: string, value: AccountType): void
  (event: 'toggle-password', id: string): void
  (event: 'remove', id: string): void
}>()

const labelsToString = (labels: AccountLabel[]) => labels.map((label) => label.text).join('; ')

const onLabelChange = (id: string, event: Event) => {
  emit('label-change', id, (event.target as HTMLInputElement).value)
}

const onLoginChange = (id: string, event: Event) => {
  emit('login-change', id, (event.target as HTMLInputElement).value)
}

const onPasswordChange = (id: string, event: Event) => {
  emit('password-change', id, (event.target as HTMLInputElement).value)
}

const onTypeChange = (id: string, event: Event) => {
  emit('type-change', id, (event.target as HTMLSelectElement).value as AccountType)
}

const onTogglePassword = (id: string) => {
  emit('toggle-password', id)
}

const onRemove = (id: string) => {
  emit('remove', id)
}

const isPasswordVisible = (id: string) => Boolean(props.showPassword?.[id])
</script>

<template>
  <section class="accounts">
    <div class="accounts__header">
      <span>Метки</span>
      <span>Тип записи</span>
      <span>Логин</span>
      <span>Пароль</span>
      <span></span>
    </div>

    <div v-if="props.accounts.length" class="accounts__body">
      <article
        v-for="account in props.accounts"
        :key="account.id"
        class="row"
        :class="{ 'row--ldap': account.type === 'ldap' }"
      >
        <div class="field">
          <label class="field__label" :for="`labels-${account.id}`">Метка</label>
          <input
            :id="`labels-${account.id}`"
            type="text"
            :value="labelsToString(account.labels)"
            maxlength="50"
            placeholder="XXX; YYYY"
            @change="onLabelChange(account.id, $event)"
          />
        </div>

        <div class="field">
          <label class="field__label" :for="`type-${account.id}`">Тип записи</label>
          <select
            :id="`type-${account.id}`"
            :value="account.type"
            :class="{ 'is-invalid': props.isInvalid(account.id, 'type') }"
            @change="onTypeChange(account.id, $event)"
          >
            <option value="ldap">LDAP</option>
            <option value="local">Локальная</option>
          </select>
          <small
            class="field__error"
            :class="{ 'field__error--visible': props.isInvalid(account.id, 'type') }"
          >
            {{ props.errorMessage(account.id, 'type') }}
          </small>
        </div>

        <div class="field field--login">
          <label class="field__label" :for="`login-${account.id}`">Логин *</label>
          <input
            :id="`login-${account.id}`"
            :value="account.login"
            type="text"
            maxlength="100"
            placeholder="user@example.com"
            :class="{ 'is-invalid': props.isInvalid(account.id, 'login') }"
            @change="onLoginChange(account.id, $event)"
            @blur="emit('login-blur', account.id)"
          />
          <small
            class="field__error"
            :class="{ 'field__error--visible': props.isInvalid(account.id, 'login') }"
          >
            {{ props.errorMessage(account.id, 'login') }}
          </small>
        </div>

        <div v-if="account.type === 'local'" class="field field--password">
          <label class="field__label" :for="`password-${account.id}`">Пароль *</label>
          <div class="password-field">
            <input
              :id="`password-${account.id}`"
              :value="account.password ?? ''"
              :type="isPasswordVisible(account.id) ? 'text' : 'password'"
              maxlength="100"
              placeholder="Значение"
              :class="{ 'is-invalid': props.isInvalid(account.id, 'password') }"
              @change="onPasswordChange(account.id, $event)"
              @blur="emit('password-blur', account.id)"
            />
            <button
              class="icon-btn"
              type="button"
              :aria-label="isPasswordVisible(account.id) ? 'Скрыть пароль' : 'Показать пароль'"
              @click="onTogglePassword(account.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 5C6.5 5 2.1 8.5 1 12c1.1 3.5 5.5 7 11 7s9.9-3.5 11-7c-1.1-3.5-5.5-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <small
            class="field__error"
            :class="{ 'field__error--visible': props.isInvalid(account.id, 'password') }"
          >
            {{ props.errorMessage(account.id, 'password') }}
          </small>
        </div>

        <div class="actions">
          <button
            class="trash-btn"
            type="button"
            aria-label="Удалить учетную запись"
            @click="onRemove(account.id)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v8h-2v-8zm4 0h2v8h-2v-8zM7 10h2v8H7v-8zm-1 11h12a2 2 0 0 0 2-2V8H4v11a2 2 0 0 0 2 2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </article>
    </div>

    <div v-else class="empty">
      <p>Пока нет учетных записей. Нажмите «+ Добавить», чтобы создать первую.</p>
    </div>
  </section>
</template>

<style scoped>
.accounts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.accounts__header {
  display: grid;
  grid-template-columns: 2.2fr 1.2fr 1.6fr 1.6fr 40px;
  gap: 12px;
  padding: 0 6px;
  font-size: 0.85rem;
  color: #7b8794;
}

.accounts__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: 2.2fr 1.2fr 1.6fr 1.6fr 40px;
  gap: 12px;
  align-items: start;
}

.row--ldap .field--login {
  grid-column: 3 / 5;
}

.row--ldap .field--password {
  display: none;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  display: none;
  font-size: 0.7rem;
  color: #95a1ad;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input,
select {
  height: 38px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cfd8e3;
  background: #fff;
  font-size: 0.95rem;
  color: #1f2a33;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder {
  color: #a6b0ba;
}

input:focus,
select:focus {
  outline: none;
  border-color: #8fa4b8;
  box-shadow: 0 0 0 3px rgba(143, 164, 184, 0.2);
}

.password-field {
  position: relative;
}

.password-field input {
  width: 100%;
  padding-right: 38px;
}

.icon-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #7a8794;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.is-invalid {
  border-color: #d96c6c;
  box-shadow: 0 0 0 3px rgba(217, 108, 108, 0.18);
}

.field__error {
  min-height: 16px;
  visibility: hidden;
  font-size: 0.75rem;
  color: #d96c6c;
}

.field__error--visible {
  visibility: visible;
}


.actions {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.trash-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #cfd8e3;
  background: #fff;
  color: #6b7785;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.trash-btn svg {
  width: 18px;
  height: 18px;
}

.trash-btn:hover {
  border-color: #94a3b3;
  box-shadow: 0 0 0 3px rgba(148, 163, 179, 0.2);
}

.empty {
  padding: 24px;
  border-radius: 12px;
  border: 1px dashed #d7e1ee;
  color: #7b8794;
  text-align: center;
}

@media (max-width: 960px) {
  .accounts__header {
    display: none;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e1e8f0;
    background: #fff;
  }

  .field__label {
    display: block;
  }

  .actions {
    justify-content: flex-start;
  }
}
</style>
