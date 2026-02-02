import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type AccountType = 'ldap' | 'local'

export interface AccountLabel {
  text: string
}

export interface Account {
  id: string
  labels: AccountLabel[]
  type: AccountType
  login: string
  password: string | null
}

const STORAGE_KEY = 'vue-test-task-accounts'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `acc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

const makeEmptyAccount = (): Account => ({
  id: createId(),
  labels: [],
  type: 'local',
  login: '',
  password: ''
})

const sanitizeAccount = (raw: unknown): Account | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<Account>
  const type = data.type === 'ldap' || data.type === 'local' ? data.type : 'local'
  const labels = Array.isArray(data.labels)
    ? data.labels
        .filter((item) => item && typeof item === 'object' && typeof (item as AccountLabel).text === 'string')
        .map((item) => ({ text: String((item as AccountLabel).text) }))
    : []
  const login = typeof data.login === 'string' ? data.login : ''
  const password = type === 'ldap' ? null : typeof data.password === 'string' ? data.password : ''

  return {
    id: typeof data.id === 'string' ? data.id : createId(),
    labels,
    type,
    login,
    password
  }
}

const loadFromStorage = (): Account[] => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeAccount).filter((item): item is Account => item !== null)
  } catch {
    return []
  }
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>(loadFromStorage())

  const addAccount = () => {
    const account = makeEmptyAccount()
    accounts.value.push(account)
    return account.id
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id)
  }

  watch(
    accounts,
    (value) => {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  return {
    accounts,
    addAccount,
    removeAccount
  }
})
