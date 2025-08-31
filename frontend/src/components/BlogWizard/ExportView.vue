<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 6: エクスポート
    </h2>
    
    <div class="mb-8">
      <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-green-800 dark:text-green-300 font-semibold">
              記事が完成しました！
            </p>
            <p class="text-green-700 dark:text-green-400 text-sm mt-1">
              お好みの形式でエクスポートしてください。
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Article Info -->
    <div v-if="finalArticle" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <h3 class="font-semibold text-gray-800 dark:text-white mb-2">記事情報</h3>
      <div class="space-y-1 text-sm">
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">タイトル:</span> {{ finalArticle.title }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">ジャンル:</span> {{ finalArticle.genre }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">テーマ:</span> {{ finalArticle.theme }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">文字数:</span> {{ finalArticle.content.length.toLocaleString() }} 文字
        </p>
        <div v-if="finalArticle.keywords.length > 0" class="mt-2">
          <p class="font-semibold text-gray-600 dark:text-gray-300 mb-1">キーワード:</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in finalArticle.keywords"
              :key="keyword"
              class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Export Options -->
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <div class="space-y-3">
        <h3 class="font-semibold text-gray-800 dark:text-white">ファイル形式でエクスポート</h3>
        
        <button
          @click="exportMarkdown"
          class="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-white">Markdown (.md)</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">GitHub、Notionなどでそのまま使用可能</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        <button
          @click="exportHTML"
          class="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-white">HTML (.html)</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Webサイトですぐに公開可能</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        <button
          @click="exportText"
          class="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-white">テキスト (.txt)</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">プレーンテキスト形式</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-3">
        <h3 class="font-semibold text-gray-800 dark:text-white">その他のアクション</h3>
        
        <button
          @click="copyToClipboard"
          class="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-white">クリップボードにコピー</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Markdown形式でコピー</p>
            </div>
          </div>
        </button>
        
        <button
          @click="saveToHistory"
          :disabled="isSaved"
          class="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 dark:text-white">
                {{ isSaved ? '履歴に保存済み' : '履歴に保存' }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ isSaved ? '既に保存されています' : 'ブラウザに保存して後で確認' }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Success Messages -->
    <div v-if="successMessage" class="mb-6">
      <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p class="text-green-800 dark:text-green-300 text-sm">{{ successMessage }}</p>
      </div>
    </div>
    
    <div class="flex justify-between">
      <button
        @click="$emit('previous')"
        class="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        戻る
      </button>
      
      <div class="space-x-2">
        <button
          @click="createAnother"
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          新しい記事を作成
        </button>
        <router-link
          to="/history"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition inline-block"
        >
          履歴を確認
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/article'
import { useHistoryStore } from '../../stores/history'
import { exportService } from '../../services/exportService'

const emit = defineEmits(['previous'])
const router = useRouter()
const articleStore = useArticleStore()
const historyStore = useHistoryStore()

const finalArticle = computed(() => articleStore.finalArticle)
const successMessage = ref('')
const isSaved = ref(false)

const showSuccess = (message: string) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const exportMarkdown = () => {
  if (!finalArticle.value) return
  exportService.exportAsMarkdown(finalArticle.value)
  showSuccess('Markdownファイルをダウンロードしました')
}

const exportHTML = () => {
  if (!finalArticle.value) return
  exportService.exportAsHTML(finalArticle.value)
  showSuccess('HTMLファイルをダウンロードしました')
}

const exportText = () => {
  if (!finalArticle.value) return
  exportService.exportAsText(finalArticle.value)
  showSuccess('テキストファイルをダウンロードしました')
}

const copyToClipboard = async () => {
  if (!finalArticle.value) return
  try {
    await exportService.copyToClipboard(finalArticle.value)
    showSuccess('クリップボードにコピーしました')
  } catch (error) {
    showSuccess('コピーに失敗しました')
  }
}

const saveToHistory = () => {
  if (!finalArticle.value || isSaved.value) return
  
  historyStore.addArticle(finalArticle.value)
  isSaved.value = true
  showSuccess('記事を履歴に保存しました')
  
  // Clear cache after saving to history
  articleStore.clearCache()
}

const createAnother = () => {
  articleStore.resetWorkflow()
  router.push('/create')
}

onMounted(() => {
  // Auto-save to history
  if (finalArticle.value && !isSaved.value) {
    saveToHistory()
  }
})
</script>