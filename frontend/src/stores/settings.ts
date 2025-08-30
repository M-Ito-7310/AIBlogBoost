import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // API Key management
  const apiKey = ref<string>('')
  const isApiKeyConfigured = computed(() => !!apiKey.value)
  
  // Theme
  const isDarkMode = ref(false)
  
  // Language
  const currentLanguage = ref<'ja' | 'en'>('ja')
  
  // Initialize from localStorage
  const initialize = () => {
    const savedApiKey = localStorage.getItem('gemini_api_key')
    if (savedApiKey) {
      apiKey.value = savedApiKey
    }
    
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    
    const savedLanguage = localStorage.getItem('language') as 'ja' | 'en'
    if (savedLanguage) {
      currentLanguage.value = savedLanguage
    }
  }
  
  // Save API Key
  const setApiKey = (key: string) => {
    apiKey.value = key
    localStorage.setItem('gemini_api_key', key)
  }
  
  // Clear API Key
  const clearApiKey = () => {
    apiKey.value = ''
    localStorage.removeItem('gemini_api_key')
  }
  
  // Toggle theme
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    updateThemeClass()
  }
  
  // Update theme class on document
  const updateThemeClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Change language
  const setLanguage = (lang: 'ja' | 'en') => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }
  
  // Initialize on store creation
  initialize()
  updateThemeClass()
  
  return {
    apiKey,
    isApiKeyConfigured,
    isDarkMode,
    currentLanguage,
    setApiKey,
    clearApiKey,
    toggleTheme,
    setLanguage
  }
})