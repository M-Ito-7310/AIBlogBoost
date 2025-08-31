<template>
  <div class="min-h-screen bg-transparent py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">作成履歴</h1>
      
      <div v-if="articles.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          まだ記事が作成されていません
        </p>
        <router-link
          to="/create"
          class="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          記事を作成する
        </router-link>
      </div>
      
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="article in articles"
          :key="article.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white flex-1 mr-2">
                {{ article.title }}
              </h2>
              <button
                @click="toggleFavorite(article.id)"
                class="text-yellow-500 hover:text-yellow-600"
              >
                <svg
                  class="w-6 h-6"
                  :fill="article.isFavorite ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
            
            <div class="space-y-2 mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">ジャンル:</span> {{ article.genre }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">テーマ:</span> {{ article.theme }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">作成日:</span> {{ formatDate(article.createdAt) }}
              </p>
              <div v-if="article.keywords.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="keyword in article.keywords.slice(0, 3)"
                  :key="keyword"
                  class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button
                @click="viewArticle(article)"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm"
              >
                表示
              </button>
              <button
                @click="exportArticle(article)"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-sm"
              >
                エクスポート
              </button>
              <button
                @click="deleteArticle(article.id)"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded text-sm"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Article Modal -->
    <div
      v-if="selectedArticle"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="selectedArticle = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ selectedArticle.title }}
            </h2>
            <button
              @click="selectedArticle = null"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="prose dark:prose-invert max-w-none" v-html="renderMarkdown(selectedArticle.content)" />
        </div>
        
        <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div class="flex space-x-2">
            <button
              @click="copyToClipboard(selectedArticle)"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
            >
              クリップボードにコピー
            </button>
            <button
              @click="exportAsMarkdown(selectedArticle)"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Markdown
            </button>
            <button
              @click="exportAsHTML(selectedArticle)"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              HTML
            </button>
            <button
              @click="exportAsText(selectedArticle)"
              class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            >
              テキスト
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHistoryStore } from '../stores/history'
import { exportService } from '../services/exportService'
import type { SavedArticle } from '../stores/history'

const historyStore = useHistoryStore()
const selectedArticle = ref<SavedArticle | null>(null)

const articles = computed(() => historyStore.articles)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleFavorite = (id: string) => {
  historyStore.toggleFavorite(id)
}

const viewArticle = (article: SavedArticle) => {
  selectedArticle.value = article
}

const deleteArticle = (id: string) => {
  if (confirm('この記事を削除してもよろしいですか？')) {
    historyStore.removeArticle(id)
  }
}

const exportArticle = (article: SavedArticle) => {
  exportService.exportAsMarkdown(article)
}

const copyToClipboard = async (article: SavedArticle) => {
  await exportService.copyToClipboard(article)
  alert('クリップボードにコピーしました')
}

const exportAsMarkdown = (article: SavedArticle) => {
  exportService.exportAsMarkdown(article)
}

const exportAsHTML = (article: SavedArticle) => {
  exportService.exportAsHTML(article)
}

const exportAsText = (article: SavedArticle) => {
  exportService.exportAsText(article)
}

const renderMarkdown = (markdown: string) => {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}
</script>