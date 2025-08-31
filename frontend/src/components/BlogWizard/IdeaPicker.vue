<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 3: アイデアを選択（最大3つ）
    </h2>
    
    <!-- Selection Summary -->
    <div v-if="selectedIdeas.length > 0" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
      <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">選択済みアイデア ({{ selectedIdeas.length }}/3)</h3>
      <div class="space-y-2">
        <div v-for="selected in selectedIdeasSorted" :key="selected.idea.id" class="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2">
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold px-2 py-1 bg-blue-600 text-white rounded">{{ selected.priority }}</span>
            <span class="text-sm font-medium">{{ selected.idea.title }}</span>
          </div>
          <button @click="removeSelectedIdea(selected.idea.id)" class="text-red-500 hover:text-red-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="mb-6">
      <p class="text-gray-600 dark:text-gray-300">
        ジャンル: <span class="font-semibold">{{ selectedGenre }}</span> | 
        テーマ: <span class="font-semibold">{{ selectedTheme }}</span>
      </p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">AIがアイデアを生成中...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <p class="text-red-800 dark:text-red-300">{{ error }}</p>
      <button
        @click="generateIdeas"
        class="mt-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
      >
        再試行
      </button>
    </div>
    
    <!-- Ideas List -->
    <div v-else-if="ideas.length > 0" class="space-y-4 mb-8">
      <div
        v-for="(idea, index) in ideas"
        :key="idea.id"
        class="relative"
      >
        <div
          @click="toggleIdeaSelection(idea)"
          class="p-4 border-2 rounded-lg cursor-pointer transition hover:shadow-lg"
          :class="getIdeaCardClass(idea)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
                  {{ idea.title }}
                </h3>
                <span v-if="getSelectedPriority(idea)" class="text-sm font-bold px-2 py-1 bg-blue-600 text-white rounded">
                  優先度{{ getSelectedPriority(idea) }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">
                {{ idea.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in idea.keywords"
                  :key="keyword"
                  class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            <button
              @click.stop="regenerateSingleIdea(index)"
              :disabled="isRegeneratingIdea === index"
              class="ml-4 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50"
              title="このアイデアを再生成"
            >
              <svg v-if="isRegeneratingIdea !== index" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div v-else class="animate-spin">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <button
        @click="generateIdeas"
        class="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        すべて再生成
      </button>
    </div>
    
    <!-- Initial State -->
    <div v-else class="text-center py-8">
      <button
        @click="generateIdeas"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg"
      >
        アイデアを生成
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
        :disabled="selectedIdeas.length === 0"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        次へ（草案生成）
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../../stores/article'
import { geminiService } from '../../services/geminiService'
import type { BlogIdea, SelectedIdea } from '../../stores/article'

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const selectedGenre = computed(() => articleStore.selectedGenre)
const selectedTheme = computed(() => articleStore.selectedTheme)
const ideas = ref<BlogIdea[]>(articleStore.generatedIdeas || [])
const selectedIdeas = ref<SelectedIdea[]>(articleStore.selectedIdeas || [])
const isLoading = ref(false)
const isRegeneratingIdea = ref<number | null>(null)
const error = ref('')

const generateIdeas = async () => {
  if (!geminiService.isInitialized()) {
    error.value = 'Gemini APIキーが設定されていません。設定画面でAPIキーを設定してください。'
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    const generatedIdeas = await geminiService.generateIdeas(
      selectedGenre.value,
      selectedTheme.value
    )
    ideas.value = generatedIdeas
    articleStore.setIdeas(generatedIdeas)
    selectedIdeas.value = []
  } catch (err) {
    error.value = 'アイデアの生成に失敗しました。もう一度お試しください。'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const regenerateSingleIdea = async (index: number) => {
  if (!geminiService.isInitialized()) {
    error.value = 'Gemini APIキーが設定されていません。設定画面でAPIキーを設定してください。'
    return
  }

  isRegeneratingIdea.value = index
  error.value = ''
  
  try {
    const newIdea = await geminiService.generateSingleIdea(
      selectedGenre.value,
      selectedTheme.value,
      index + 1
    )
    
    // Replace the idea at the specific index
    const oldId = ideas.value[index].id
    ideas.value[index] = newIdea
    articleStore.setIdeas([...ideas.value])
    
    // Update selected ideas if this idea was selected
    const selectedIndex = selectedIdeas.value.findIndex(s => s.idea.id === oldId)
    if (selectedIndex !== -1) {
      selectedIdeas.value[selectedIndex].idea = newIdea
      articleStore.selectIdeas([...selectedIdeas.value])
    }
  } catch (err) {
    error.value = `アイデア${index + 1}の再生成に失敗しました。`
    console.error(err)
  } finally {
    isRegeneratingIdea.value = null
  }
}

const toggleIdeaSelection = (idea: BlogIdea) => {
  const existingIndex = selectedIdeas.value.findIndex(s => s.idea.id === idea.id)
  
  if (existingIndex !== -1) {
    // Remove if already selected
    selectedIdeas.value.splice(existingIndex, 1)
    // Reorder priorities
    selectedIdeas.value.forEach((selected, index) => {
      selected.priority = index + 1
    })
  } else if (selectedIdeas.value.length < 3) {
    // Add with next priority
    selectedIdeas.value.push({
      idea,
      priority: selectedIdeas.value.length + 1
    })
  }
  
  articleStore.selectIdeas([...selectedIdeas.value])
}

const removeSelectedIdea = (ideaId: string) => {
  const index = selectedIdeas.value.findIndex(s => s.idea.id === ideaId)
  if (index !== -1) {
    selectedIdeas.value.splice(index, 1)
    // Reorder priorities
    selectedIdeas.value.forEach((selected, index) => {
      selected.priority = index + 1
    })
    articleStore.selectIdeas([...selectedIdeas.value])
  }
}

const getSelectedPriority = (idea: BlogIdea): number | null => {
  const selected = selectedIdeas.value.find(s => s.idea.id === idea.id)
  return selected?.priority || null
}

const getIdeaCardClass = (idea: BlogIdea): string => {
  const isSelected = selectedIdeas.value.some(s => s.idea.id === idea.id)
  const canSelect = selectedIdeas.value.length < 3
  
  if (isSelected) {
    return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
  } else if (canSelect) {
    return 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
  } else {
    return 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
  }
}

const selectedIdeasSorted = computed(() => {
  return [...selectedIdeas.value].sort((a, b) => a.priority - b.priority)
})

const proceedToNext = () => {
  if (selectedIdeas.value.length === 0) return
  emit('next')
}

onMounted(() => {
  if (ideas.value.length === 0) {
    generateIdeas()
  }
})
</script>