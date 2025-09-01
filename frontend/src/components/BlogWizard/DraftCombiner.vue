<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 5: 記事をまとめる
    </h2>
    
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      生成された3つの草案から良い部分を組み合わせて、完成した記事を作成します。
    </p>
    
    <!-- Drafts Summary -->
    <div class="grid md:grid-cols-3 gap-4 mb-6">
      <div
        v-for="(draft, index) in drafts"
        :key="draft.id"
        @click="viewDraftPreview(draft)"
        class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition"
      >
        <h3 class="font-semibold text-gray-800 dark:text-white mb-2">
          草案{{ index + 1 }}: {{ draft.tone }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {{ draft.title }}
        </p>
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-500 dark:text-gray-500">
            {{ Math.floor(draft.content.length / 100) * 100 }}文字程度
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-400">
            クリックして全文表示
          </div>
        </div>
      </div>
    </div>
    
    <!-- Combination Instructions -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        組み合わせの指示（オプション）
      </label>
      <textarea
        v-model="instructions"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="例: プロフェッショナルな構成で、カジュアルな表現を混ぜ、実用的な内容を重視してください"
      />
    </div>
    
    <!-- Quick Templates -->
    <div class="mb-6">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        クイック指示テンプレート:
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="template in instructionTemplates"
          :key="template.id"
          @click="instructions = template.text"
          class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {{ template.label }}
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 mb-6">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">記事をまとめています...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p class="text-red-800 dark:text-red-300">{{ error }}</p>
      <button
        @click="combineArticle"
        class="mt-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
      >
        再試行
      </button>
    </div>
    
    <!-- Final Article Preview -->
    <div v-else-if="finalContent" class="mb-6">
      <div class="border border-gray-300 dark:border-gray-600 rounded-lg">
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
          <h3 class="font-semibold text-gray-800 dark:text-white">完成した記事</h3>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ finalContent.length.toLocaleString() }}文字
          </span>
        </div>
        
        <div class="p-4">
          <div class="max-h-96 overflow-y-auto">
            <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {{ finalContent }}
            </div>
          </div>
          
          <div class="mt-4 flex space-x-2">
            <button
              @click="viewFullArticle = !viewFullArticle"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm"
            >
              {{ viewFullArticle ? '閉じる' : '全文を表示' }}
            </button>
            <button
              @click="editArticle = !editArticle"
              class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm"
            >
              {{ editArticle ? 'プレビュー' : '編集' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Edit Mode -->
      <div v-if="editArticle" class="mt-4">
        <textarea
          v-model="finalContent"
          rows="20"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        />
      </div>
      
      <button
        @click="combineArticle"
        class="w-full mt-4 text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold py-2"
      >
        記事を再生成
      </button>
    </div>
    
    <!-- Generate Article Button (Always visible when no content) -->
    <div v-if="!finalContent" class="text-center py-8 mb-6">
      <button
        @click="combineArticle"
        :disabled="isLoading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg text-lg transition"
      >
        記事を生成
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
        :disabled="!finalContent"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        完了（エクスポート）
      </button>
    </div>
    
    <!-- Full Article Modal -->
    <Teleport to="body">
      <div
        v-if="viewFullArticle"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
        @click.self="viewFullArticle = false"
      >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                完成した記事
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ finalContent.length.toLocaleString() }}文字
              </p>
            </div>
            <button
              @click="viewFullArticle = false"
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
            {{ finalContent }}
          </div>
        </div>
      </div>
      </div>
    </Teleport>
    
    <!-- Draft Preview Modal -->
    <Teleport to="body">
      <div
        v-if="viewingDraftPreview"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
        @click.self="viewingDraftPreview = null"
      >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                {{ viewingDraftPreview.tone }}トーン: {{ viewingDraftPreview.title }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ Math.floor(viewingDraftPreview.content.length / 100) * 100 }}文字程度
              </p>
            </div>
            <button
              @click="viewingDraftPreview = null"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Outline -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">アウトライン</h3>
          <ul class="list-disc list-inside space-y-2">
            <li
              v-for="(item, index) in viewingDraftPreview.outline"
              :key="index"
              class="text-gray-600 dark:text-gray-400"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">本文</h3>
          <div class="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {{ viewingDraftPreview.content }}
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

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const drafts = computed(() => articleStore.generatedDrafts)
const instructions = ref('')
const finalContent = ref('')
const isLoading = ref(false)
const error = ref('')
const viewFullArticle = ref(false)
const editArticle = ref(false)
const viewingDraftPreview = ref<BlogDraft | null>(null)

const instructionTemplates = [
  {
    id: 'professional',
    label: 'プロフェッショナル',
    text: 'プロフェッショナルなトーンを基調とし、信頼性の高い内容にしてください'
  },
  {
    id: 'casual',
    label: 'カジュアル',
    text: 'カジュアルで親しみやすいトーンを重視し、読みやすい文体で作成してください'
  },
  {
    id: 'educational',
    label: '教育的',
    text: '教育的な視点を重視し、学習効果の高い構成と説明を含めてください'
  },
  {
    id: 'balanced',
    label: 'バランス重視',
    text: '各草案の良い部分をバランス良く組み合わせて、読みやすい記事を作成してください'
  },
  {
    id: 'practical',
    label: '実用性重視',
    text: '実用的で行動につながる内容を重視し、具体的な例やステップを含めてください'
  },
  {
    id: 'engaging',
    label: '魅力的',
    text: '読者の興味を引く魅力的な表現を使い、最後まで読んでもらえる記事にしてください'
  }
]

const combineArticle = async () => {
  if (drafts.value.length === 0) return
  
  if (!geminiService.isInitialized()) {
    error.value = 'Gemini APIキーが設定されていません。設定画面でAPIキーを設定してください。'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    const combined = await geminiService.combineDrafts(drafts.value, instructions.value)
    finalContent.value = combined
    
    // Create final article object
    const finalArticle = {
      title: extractTitle(combined) || drafts.value[0]?.title || 'Generated Article',
      content: combined,
      genre: articleStore.selectedGenre,
      theme: articleStore.selectedTheme,
      keywords: articleStore.selectedIdea?.keywords || [],
      createdAt: new Date()
    }
    
    articleStore.setFinalArticle(finalArticle)
  } catch (err) {
    error.value = '記事のまとめに失敗しました。もう一度お試しください。'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const viewDraftPreview = (draft: BlogDraft) => {
  viewingDraftPreview.value = draft
}

const extractTitle = (content: string): string | null => {
  const lines = content.split('\n')
  const titleLine = lines.find(line => line.trim().startsWith('#'))
  return titleLine ? titleLine.replace(/^#+\s*/, '').trim() : null
}

const proceedToNext = () => {
  if (!finalContent.value) return
  emit('next')
}

onMounted(() => {
  // Load existing final content if available
  if (articleStore.finalArticle?.content) {
    finalContent.value = articleStore.finalArticle.content
  }
})
</script>