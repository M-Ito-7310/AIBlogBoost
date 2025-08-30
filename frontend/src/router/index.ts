import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'
import HistoryView from '../views/HistoryView.vue'
import SettingsView from '../views/SettingsView.vue'
import { useSettingsStore } from '../stores/settings'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      beforeEnter: (to, from, next) => {
        const settingsStore = useSettingsStore()
        if (!settingsStore.isApiKeyConfigured) {
          next('/settings')
        } else {
          next()
        }
      }
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

export default router