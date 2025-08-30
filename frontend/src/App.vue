<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              <!-- AI/Brain icon -->
              <svg class="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 32 20">
                <path d="M8 6c-2.5 0-4.5 2-4.5 4.5 0 1.2 0.5 2.3 1.3 3.1C4.3 14.2 4 15.1 4 16c0 2.5 2 4.5 4.5 4.5h15c2.5 0 4.5-2 4.5-4.5 0-0.9-0.3-1.8-0.8-2.4 0.8-0.8 1.3-1.9 1.3-3.1C28.5 8 26.5 6 24 6c-1 0-1.9 0.3-2.6 0.8C20.6 6.3 19.8 6 19 6h-3c-0.8 0-1.6 0.3-2.4 0.8C12.9 6.3 12 6 11 6H8z"/>
              </svg>
              <!-- Pen icon -->
              <svg class="w-3 h-3 text-yellow-300 absolute bottom-0.5 right-0.5 transform rotate-45" fill="currentColor" viewBox="0 0 12 16">
                <rect x="4" y="0" width="2" height="12"/>
                <polygon points="4,12 6,12 5,16"/>
              </svg>
              <!-- Sparkle -->
              <div class="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full"></div>
            </div>
            <span class="text-xl font-bold text-gray-800 dark:text-white">AIBlogBoost</span>
          </router-link>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link
              to="/"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'home' }"
            >
              ホーム
            </router-link>
            <router-link
              to="/create"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'create' }"
            >
              記事作成
            </router-link>
            <router-link
              to="/history"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'history' }"
            >
              履歴
            </router-link>
            <router-link
              to="/settings"
              class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'settings' }"
            >
              設定
            </router-link>
          </div>
          
          <!-- Theme Toggle -->
          <div class="flex items-center space-x-2">
            <button
              @click="toggleTheme"
              class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <svg v-if="!isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            
            <!-- Mobile Menu Button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-2">
            <router-link
              to="/"
              @click="mobileMenuOpen = false"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'home' }"
            >
              ホーム
            </router-link>
            <router-link
              to="/create"
              @click="mobileMenuOpen = false"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'create' }"
            >
              記事作成
            </router-link>
            <router-link
              to="/history"
              @click="mobileMenuOpen = false"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'history' }"
            >
              履歴
            </router-link>
            <router-link
              to="/settings"
              @click="mobileMenuOpen = false"
              class="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'settings' }"
            >
              設定
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main>
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <div class="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              <!-- AI/Brain icon -->
              <svg class="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 32 20">
                <path d="M8 6c-2.5 0-4.5 2-4.5 4.5 0 1.2 0.5 2.3 1.3 3.1C4.3 14.2 4 15.1 4 16c0 2.5 2 4.5 4.5 4.5h15c2.5 0 4.5-2 4.5-4.5 0-0.9-0.3-1.8-0.8-2.4 0.8-0.8 1.3-1.9 1.3-3.1C28.5 8 26.5 6 24 6c-1 0-1.9 0.3-2.6 0.8C20.6 6.3 19.8 6 19 6h-3c-0.8 0-1.6 0.3-2.4 0.8C12.9 6.3 12 6 11 6H8z"/>
              </svg>
              <!-- Pen icon -->
              <svg class="w-2 h-2 text-yellow-300 absolute bottom-0.5 right-0.5 transform rotate-45" fill="currentColor" viewBox="0 0 12 16">
                <rect x="4" y="0" width="2" height="12"/>
                <polygon points="4,12 6,12 5,16"/>
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              © 2025 AIBlogBoost. Powered by Google Gemini.
            </p>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span v-if="isApiKeyConfigured" class="text-green-600 dark:text-green-400">
              ✓ APIキー設定済み
            </span>
            <span v-else class="text-red-600 dark:text-red-400">
              ⚠ APIキー未設定
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore()
const mobileMenuOpen = ref(false)

const isDarkMode = computed(() => settingsStore.isDarkMode)
const isApiKeyConfigured = computed(() => settingsStore.isApiKeyConfigured)

const toggleTheme = () => {
  settingsStore.toggleTheme()
}
</script>

<style>
/* Global styles */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>