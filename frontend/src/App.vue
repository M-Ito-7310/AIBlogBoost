<template>
  <div id="app" class="min-h-screen relative overflow-hidden" :style="backgroundStyle">
    <!-- Floating Background Elements -->
    <div class="floating-blob w-96 h-96 bg-gradient-to-br from-primary-300/40 to-accent-300/40 top-10 -right-20 animate-blob"></div>
    <div class="floating-blob w-80 h-80 bg-gradient-to-br from-mint-300/30 to-primary-300/30 top-1/2 -left-16 animate-blob" style="animation-delay: -2s;"></div>
    <div class="floating-blob w-64 h-64 bg-gradient-to-br from-accent-300/30 to-mint-300/30 bottom-20 right-1/4 animate-blob" style="animation-delay: -4s;"></div>
    <div class="floating-blob w-72 h-72 bg-gradient-to-br from-primary-200/25 to-mint-200/25 top-1/3 right-1/3 animate-blob" style="animation-delay: -6s;"></div>
    
    <!-- Navigation -->
    <nav class="glass-card border-b border-white/10 dark:border-surface-700/30 relative z-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
              <!-- AI/Brain icon -->
              <svg class="w-5 h-5 text-white absolute top-1 left-1" fill="currentColor" viewBox="0 0 32 20">
                <path d="M8 6c-2.5 0-4.5 2-4.5 4.5 0 1.2 0.5 2.3 1.3 3.1C4.3 14.2 4 15.1 4 16c0 2.5 2 4.5 4.5 4.5h15c2.5 0 4.5-2 4.5-4.5 0-0.9-0.3-1.8-0.8-2.4 0.8-0.8 1.3-1.9 1.3-3.1C28.5 8 26.5 6 24 6c-1 0-1.9 0.3-2.6 0.8C20.6 6.3 19.8 6 19 6h-3c-0.8 0-1.6 0.3-2.4 0.8C12.9 6.3 12 6 11 6H8z"/>
              </svg>
              <!-- Pen icon -->
              <svg class="w-3 h-3 text-yellow-300 absolute bottom-1 right-1 transform rotate-45" fill="currentColor" viewBox="0 0 12 16">
                <rect x="4" y="0" width="2" height="12"/>
                <polygon points="4,12 6,12 5,16"/>
              </svg>
              <!-- Sparkle -->
              <div class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-2xl font-display font-bold text-gradient">AIBlogBoost</h1>
              <p class="text-xs subtitle-editorial -mt-1">AI-Powered Writing</p>
            </div>
          </router-link>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/"
              class="font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 relative group"
              :class="{ 'text-primary-600 dark:text-primary-400': $route.name === 'home' }"
            >
              ホーム
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.name === 'home' }"></span>
            </router-link>
            <router-link
              to="/create"
              class="font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 relative group"
              :class="{ 'text-primary-600 dark:text-primary-400': $route.name === 'create' }"
            >
              記事作成
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.name === 'create' }"></span>
            </router-link>
            <router-link
              to="/history"
              class="font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 relative group"
              :class="{ 'text-primary-600 dark:text-primary-400': $route.name === 'history' }"
            >
              履歴
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.name === 'history' }"></span>
            </router-link>
            <router-link
              to="/settings"
              class="font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 relative group"
              :class="{ 'text-primary-600 dark:text-primary-400': $route.name === 'settings' }"
            >
              設定
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.name === 'settings' }"></span>
            </router-link>
          </div>
          
          <!-- Theme Toggle -->
          <div class="flex items-center space-x-2">
            <button
              @click="toggleTheme"
              class="p-3 rounded-2xl text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-surface-800/50 transition-all duration-300 group"
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
              class="md:hidden p-3 rounded-2xl text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-surface-800/50 transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-white/10 dark:border-surface-700/30 backdrop-blur-sm">
          <div class="space-y-1">
            <router-link
              to="/"
              @click="mobileMenuOpen = false"
              class="block py-3 px-4 rounded-xl font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/30 dark:hover:bg-surface-800/30 transition-all duration-300"
              :class="{ 'text-primary-600 dark:text-primary-400 bg-white/40 dark:bg-surface-800/40': $route.name === 'home' }"
            >
              ホーム
            </router-link>
            <router-link
              to="/create"
              @click="mobileMenuOpen = false"
              class="block py-3 px-4 rounded-xl font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/30 dark:hover:bg-surface-800/30 transition-all duration-300"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'create' }"
            >
              記事作成
            </router-link>
            <router-link
              to="/history"
              @click="mobileMenuOpen = false"
              class="block py-3 px-4 rounded-xl font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/30 dark:hover:bg-surface-800/30 transition-all duration-300"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.name === 'history' }"
            >
              履歴
            </router-link>
            <router-link
              to="/settings"
              @click="mobileMenuOpen = false"
              class="block py-3 px-4 rounded-xl font-display font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/30 dark:hover:bg-surface-800/30 transition-all duration-300"
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
    <footer class="glass-card border-t border-white/10 dark:border-surface-700/30 mt-auto relative z-10">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-3 mb-4 md:mb-0">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-md">
              <!-- AI/Brain icon -->
              <svg class="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 32 20">
                <path d="M8 6c-2.5 0-4.5 2-4.5 4.5 0 1.2 0.5 2.3 1.3 3.1C4.3 14.2 4 15.1 4 16c0 2.5 2 4.5 4.5 4.5h15c2.5 0 4.5-2 4.5-4.5 0-0.9-0.3-1.8-0.8-2.4 0.8-0.8 1.3-1.9 1.3-3.1C28.5 8 26.5 6 24 6c-1 0-1.9 0.3-2.6 0.8C20.6 6.3 19.8 6 19 6h-3c-0.8 0-1.6 0.3-2.4 0.8C12.9 6.3 12 6 11 6H8z"/>
              </svg>
              <!-- Pen icon -->
              <svg class="w-3 h-3 text-yellow-300 absolute bottom-0.5 right-0.5 transform rotate-45" fill="currentColor" viewBox="0 0 12 16">
                <rect x="4" y="0" width="2" height="12"/>
                <polygon points="4,12 6,12 5,16"/>
              </svg>
            </div>
            <div>
              <p class="font-serif text-surface-700 dark:text-surface-300 text-sm font-medium">
                © 2025 AIBlogBoost
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                Powered by Google Gemini
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="px-3 py-1.5 rounded-xl text-sm font-medium" :class="isApiKeyConfigured ? 'bg-mint-100 dark:bg-mint-900/30 text-mint-700 dark:text-mint-400' : 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400'">
              <span v-if="isApiKeyConfigured" class="flex items-center gap-1.5">
                <div class="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></div>
                APIキー設定済み
              </span>
              <span v-else class="flex items-center gap-1.5">
                <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                APIキー未設定
              </span>
            </div>
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

const backgroundStyle = computed(() => {
  if (isDarkMode.value) {
    return {
      background: 'linear-gradient(135deg, #1c1917 0%, #312e81 25%, #831843 50%, #065f46 75%, #1f2937 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }
  } else {
    return {
      background: 'linear-gradient(135deg, #fafaf9 0%, #f3f4f6 25%, #ede9fe 50%, #fdf2f8 75%, #ecfdf5 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }
  }
})

const toggleTheme = () => {
  settingsStore.toggleTheme()
}
</script>

<style>
/* Global styles */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  position: relative;
  z-index: 5;
}

/* Smooth transitions for route changes */
.router-link-active {
  transition: all 0.3s ease;
}
</style>