<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 4: 草案を生成
    </h2>
    
    <div class="mb-6">
      <div v-if="selectedIdeas.length > 0" class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">選択されたアイデア ({{ selectedIdeas.length }}個)</h3>
        <div class="space-y-2">
          <div v-for="selected in selectedIdeasSorted" :key="selected.idea.id" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span class="text-sm font-bold px-2 py-1 bg-blue-600 text-white rounded">{{ selected.priority }}</span>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">{{ selected.idea.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ selected.idea.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        選択されたアイデアを組み合わせて、3つの異なるトーン（プロフェッショナル、カジュアル、教育的）で草案を生成します。
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
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
          <h3 class="font-semibold text-gray-800 dark:text-white">
            {{ draft.tone }}トーン: {{ draft.title }}
          </h3>
          <button
            @click="regenerateSingleDraft(draft.tone, drafts.indexOf(draft))"
            :disabled="isRegeneratingDraft === drafts.indexOf(draft)"
            class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50"
            title="この草案を再生成"
          >
            <svg v-if="isRegeneratingDraft !== drafts.indexOf(draft)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div v-else class="animate-spin">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </button>
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
        class="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        すべて再生成
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
    <Teleport to="body">
      <div
        v-if="viewingDraft"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
        @click.self="viewingDraft = null"
      >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../../stores/article'
import { geminiService } from '../../services/geminiService'
import type { BlogDraft } from '../../stores/article'

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const selectedIdeas = computed(() => articleStore.selectedIdeas)
const selectedIdeasSorted = computed(() => {
  return [...selectedIdeas.value].sort((a, b) => a.priority - b.priority)
})
const drafts = ref<BlogDraft[]>(articleStore.generatedDrafts || [])
const isLoading = ref(false)
const isRegeneratingDraft = ref<number | null>(null)
const error = ref('')
const loadingMessage = ref('プロフェッショナルトーンで作成中...')
const viewingDraft = ref<BlogDraft | null>(null)

const generateDrafts = async () => {
  if (selectedIdeas.value.length === 0) return
  
  if (!geminiService.isInitialized()) {
    error.value = 'Gemini APIキーが設定されていません。設定画面でAPIキーを設定してください。'
    return
  }
  
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
    const generatedDrafts = await geminiService.generateDraftsFromMultipleIdeas(selectedIdeasSorted.value)
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

const regenerateSingleDraft = async (tone: string, index: number) => {
  if (selectedIdeas.value.length === 0) return
  
  if (!geminiService.isInitialized()) {
    error.value = 'Gemini APIキーが設定されていません。設定画面でAPIキーを設定してください。'
    return
  }
  
  isRegeneratingDraft.value = index
  error.value = ''
  
  try {
    const newDraft = await geminiService.generateSingleDraftFromMultipleIdeas(
      selectedIdeasSorted.value,
      tone,
      index + 1
    )
    
    // Replace the draft at the specific index
    drafts.value[index] = newDraft
    articleStore.setDrafts([...drafts.value])
  } catch (err) {
    error.value = `${tone}草案の再生成に失敗しました。`
    console.error(err)
  } finally {
    isRegeneratingDraft.value = null
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
  if (drafts.value.length === 0 && selectedIdeas.value.length > 0) {
    generateDrafts()
  }
})
</script>