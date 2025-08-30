import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Install Pinia for state management
app.use(createPinia())

// Install Vue Router
app.use(router)

// Mount the app
app.mount('#app')