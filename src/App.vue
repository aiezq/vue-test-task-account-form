<script setup lang="ts">
import { computed, reactive } from 'vue'
import AccountsHeader from './components/AccountsHeader.vue'
import AccountsHint from './components/AccountsHint.vue'
import AccountsTable from './components/AccountsTable.vue'
import { useAccountsStore } from './stores/accounts'
import type { Account, AccountType } from './stores/accounts'

type FieldKey = 'labels' | 'type' | 'login' | 'password'

const store = useAccountsStore()
const accounts = computed(() => store.accounts)

const touched = reactive<Record<string, Partial<Record<FieldKey, boolean>>>>({})
const errors = reactive<Record<string, Partial<Record<FieldKey, string>>>>({})
const showPassword = reactive<Record<string, boolean>>({})

const ensureState = (id: string) => {
  const touchState = (touched[id] ??= {})
  if (!errors[id]) errors[id] = {}
  if (showPassword[id] === undefined) showPassword[id] = false
  return touchState
}

const addAccount = () => {
  const id = store.addAccount()
  ensureState(id)
}

const removeAccount = (id: string) => {
  store.removeAccount(id)
  delete touched[id]
  delete errors[id]
  delete showPassword[id]
}

const parseLabels = (raw: string) =>
  raw
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((text) => ({ text }))

const validateAccount = (account: Account) => {
  const result: Partial<Record<FieldKey, string>> = {}
  if (!account.login.trim()) {
    result.login = 'Введите логин'
  } else if (account.login.length > 100) {
    result.login = 'Максимум 100 символов'
  }

  if (account.type === 'local') {
    if (!account.password || !account.password.trim()) {
      result.password = 'Введите пароль'
    } else if (account.password.length > 100) {
      result.password = 'Максимум 100 символов'
    }
  }

  return result
}

const touchField = (id: string, field: FieldKey) => {
  const touchState = ensureState(id)
  touchState[field] = true
}

const setErrors = (account: Account) => {
  errors[account.id] = validateAccount(account)
}

const isInvalid = (id: string, field: FieldKey) => Boolean(touched[id]?.[field] && errors[id]?.[field])

const errorMessage = (id: string, field: FieldKey) => errors[id]?.[field] ?? ''

const getAccount = (id: string) => store.accounts.find((account) => account.id === id)

const onLabelChange = (id: string, value: string) => {
  const account = getAccount(id)
  if (!account) return
  touchField(account.id, 'labels')
  account.labels = parseLabels(value)
  setErrors(account)
}

const onLoginChange = (id: string, value: string) => {
  const account = getAccount(id)
  if (!account) return
  account.login = value
}

const onLoginBlur = (id: string) => {
  const account = getAccount(id)
  if (!account) return
  touchField(account.id, 'login')
  setErrors(account)
}

const onPasswordChange = (id: string, value: string) => {
  const account = getAccount(id)
  if (!account) return
  account.password = value
}

const onPasswordBlur = (id: string) => {
  const account = getAccount(id)
  if (!account) return
  touchField(account.id, 'password')
  setErrors(account)
}

const onTypeChange = (id: string, type: AccountType) => {
  const account = getAccount(id)
  if (!account) return
  account.type = type
  touchField(account.id, 'type')
  touchField(account.id, 'login')
  if (account.type === 'ldap') {
    account.password = null
    showPassword[account.id] = false
  } else if (account.password === null) {
    account.password = ''
  }
  if (account.type === 'local') {
    touchField(account.id, 'password')
  }
  setErrors(account)
}

const togglePassword = (id: string) => {
  showPassword[id] = !showPassword[id]
}
</script>

<template>
  <main class="page">
    <AccountsHeader @add="addAccount" />
    <AccountsHint />
    <AccountsTable
      :accounts="accounts"
      :show-password="showPassword"
      :is-invalid="isInvalid"
      :error-message="errorMessage"
      @label-change="onLabelChange"
      @login-change="onLoginChange"
      @login-blur="onLoginBlur"
      @password-change="onPasswordChange"
      @password-blur="onPasswordBlur"
      @type-change="onTypeChange"
      @toggle-password="togglePassword"
      @remove="removeAccount"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
