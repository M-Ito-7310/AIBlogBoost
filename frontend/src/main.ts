import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useSettingsStore } from './stores/settings'
import { geminiService } from './services/geminiService'

const app = createApp(App)

// Install Pinia for state management
app.use(createPinia())

// Initialize settings and Gemini API
const settingsStore = useSettingsStore()
if (settingsStore.isApiKeyConfigured) {
  geminiService.initialize(settingsStore.apiKey)
}

// Install Vue Router
app.use(router)

// Mount the app
app.mount('#app')