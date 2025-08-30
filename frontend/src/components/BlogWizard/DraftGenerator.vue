<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 4: 草案を生成
    </h2>
    
    <div class="mb-6">
      <p class="text-gray-600 dark:text-gray-300 mb-2">
        選択したアイデア: <span class="font-semibold">{{ selectedIdea?.title }}</span>
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        3つの異なるトーン（プロフェッショナル、カジュアル、教育的）で草案を生成します。
      </p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">AIが草案を作成中...</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
        {{ loadingMessage }}
      </p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p class="text-red-800 dark:text-red-300">{{ error }}</p>
      <button
        @click="generateDrafts"
        class="mt-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
      >
        再試行
      </button>
    </div>
    
    <!-- Drafts Display -->
    <div v-else-if="drafts.length > 0" class="space-y-6 mb-8">
      <div
        v-for="draft in drafts"
        :key="draft.id"
        class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
      >
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600">
          <h3 class="font-semibold text-gray-800 dark:text-white">
            {{ draft.tone }}トーン: {{ draft.title }}
          </h3>
        </div>
        
        <div class="p-4">
          <div class="mb-3">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">アウトライン:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(item, index) in draft.outline"
                :key="index"
                class="text-sm text-gray-600 dark:text-gray-400"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">本文プレビュー:</h4>
            <div class="max-h-40 overflow-y-auto">
              <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {{ draft.content.substring(0, 500) }}{{ draft.content.length > 500 ? '...' : '' }}
              </p>
            </div>
          </div>
          
          <button
            @click="viewFullDraft(draft)"
            class="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-semibold"
          >
            全文を表示
          </button>
        </div>
      </div>
      
      <button
        @click="generateDrafts"
        class="w-full text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold py-2"
      >
        草案を再生成
      </button>
    </div>
    
    <!-- Initial State -->
    <div v-else class="text-center py-8">
      <button
        @click="generateDrafts"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg"
      >
        草案を生成
      </button>
    </div>
    
    <div class="flex justify-between">
      <button
        @click="$emit('previous')"
        class="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        戻る
      </button>
      
      <button
        @click="proceedToNext"
        :disabled="drafts.length === 0"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        次へ（記事をまとめる）
      </button>
    </div>
    
    <!-- Full Draft Modal -->
    <div
      v-if="viewingDraft"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="viewingDraft = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">
              {{ viewingDraft.tone }}トーン: {{ viewingDraft.title }}
            </h2>
            <button
              @click="viewingDraft = null"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {{ viewingDraft.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../../stores/article'
import { geminiService } from '../../services/geminiService'
import type { BlogDraft } from '../../stores/article'

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const selectedIdea = computed(() => articleStore.selectedIdea)
const drafts = ref<BlogDraft[]>(articleStore.generatedDrafts || [])
const isLoading = ref(false)
const error = ref('')
const loadingMessage = ref('プロフェッショナルトーンで作成中...')
const viewingDraft = ref<BlogDraft | null>(null)

const generateDrafts = async () => {
  if (!selectedIdea.value) return
  
  isLoading.value = true
  error.value = ''
  
  const messages = [
    'プロフェッショナルトーンで作成中...',
    'カジュアルトーンで作成中...',
    '教育的トーンで作成中...'
  ]
  
  let messageIndex = 0
  const interval = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length
    loadingMessage.value = messages[messageIndex]
  }, 3000)
  
  try {
    const generatedDrafts = await geminiService.generateDrafts(selectedIdea.value)
    drafts.value = generatedDrafts
    articleStore.setDrafts(generatedDrafts)
  } catch (err) {
    error.value = '草案の生成に失敗しました。もう一度お試しください。'
    console.error(err)
  } finally {
    clearInterval(interval)
    isLoading.value = false
  }
}

const viewFullDraft = (draft: BlogDraft) => {
  viewingDraft.value = draft
}

const proceedToNext = () => {
  if (drafts.value.length === 0) return
  emit('next')
}

onMounted(() => {
  if (drafts.value.length === 0 && selectedIdea.value) {
    generateDrafts()
  }
})
</script>