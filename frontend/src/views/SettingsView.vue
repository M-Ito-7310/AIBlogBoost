<template>
  <div class="min-h-screen bg-transparent py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">設定</h1>
      
      <!-- API Key Configuration -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Google Gemini API キー
        </h2>
        
        <div v-if="!isApiKeyConfigured" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            AIBlogBoostを使用するには、Google Gemini APIキーが必要です。
          </p>
          
          <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">APIキーの取得方法</h3>
                <ol class="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" class="underline hover:text-blue-900">
                      Google AI Studio
                    </a>
                    にアクセス
                  </li>
                  <li>Googleアカウントでログイン</li>
                  <li>「APIキーを作成」をクリック</li>
                  <li>APIキーをコピー</li>
                </ol>
              </div>
              <button
                @click="showApiKeyGuide = true"
                class="ml-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm underline whitespace-nowrap"
              >
                詳しい手順を見る
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              APIキー
            </label>
            <input
              v-model="apiKeyInput"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="AIza..."
            />
          </div>
          
          <button
            @click="saveApiKey"
            :disabled="!apiKeyInput"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            APIキーを保存
          </button>
        </div>
        
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 dark:text-green-400 font-semibold">
                ✓ APIキーが設定されています
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                キー: {{ maskedApiKey }}
              </p>
            </div>
            <button
              @click="clearApiKey"
              class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
            >
              削除
            </button>
          </div>
        </div>
      </div>
      
      <!-- Theme Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          テーマ
        </h2>
        
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">ダークモード</span>
          <button
            @click="toggleTheme"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="isDarkMode ? 'bg-blue-600' : 'bg-gray-200'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>
      
      <!-- Language Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          言語
        </h2>
        
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              type="radio"
              value="ja"
              v-model="currentLanguage"
              @change="updateLanguage"
              class="mr-2"
            />
            <span class="text-gray-700 dark:text-gray-300">日本語</span>
          </label>
          <label class="flex items-center opacity-50 cursor-not-allowed">
            <input
              type="radio"
              value="en"
              disabled
              class="mr-2"
            />
            <span class="text-gray-400 dark:text-gray-500">English</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 ml-2">(今後対応予定)</span>
          </label>
        </div>
        
        <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-xs text-gray-600 dark:text-gray-400">
            現在は日本語のみサポートしています。英語対応は将来のアップデートで実装予定です。
          </p>
        </div>
      </div>
      
      <!-- Data Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          データ管理
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-700 dark:text-gray-300">保存された記事</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ articleCount }} 件</p>
            </div>
            <button
              @click="clearAllData"
              :disabled="articleCount === 0"
              class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              すべて削除
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- API Key Guide Modal -->
    <ApiKeyGuideModal v-model="showApiKeyGuide" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useHistoryStore } from '../stores/history'
import { geminiService } from '../services/geminiService'
import ApiKeyGuideModal from '../components/ApiKeyGuideModal.vue'

const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()
const showApiKeyGuide = ref(false)

const apiKeyInput = ref('')
const isApiKeyConfigured = computed(() => settingsStore.isApiKeyConfigured)
const isDarkMode = computed(() => settingsStore.isDarkMode)
const currentLanguage = ref(settingsStore.currentLanguage)
const articleCount = computed(() => historyStore.articleCount)

const maskedApiKey = computed(() => {
  const key = settingsStore.apiKey
  if (key.length > 8) {
    return key.substring(0, 4) + '...' + key.substring(key.length - 4)
  }
  return '****'
})

const saveApiKey = () => {
  if (apiKeyInput.value) {
    settingsStore.setApiKey(apiKeyInput.value)
    geminiService.initialize(apiKeyInput.value)
    apiKeyInput.value = ''
  }
}

const clearApiKey = () => {
  if (confirm('APIキーを削除してもよろしいですか？')) {
    settingsStore.clearApiKey()
  }
}

const toggleTheme = () => {
  settingsStore.toggleTheme()
}

const updateLanguage = () => {
  settingsStore.setLanguage(currentLanguage.value)
}

const clearAllData = () => {
  if (confirm('すべての記事を削除してもよろしいですか？この操作は取り消せません。')) {
    localStorage.removeItem('article_history')
    location.reload()
  }
}

// Initialize Gemini service if API key exists
if (isApiKeyConfigured.value) {
  geminiService.initialize(settingsStore.apiKey)
}
</script>