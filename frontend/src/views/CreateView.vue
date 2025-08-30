<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Progress Bar -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
              記事作成ウィザード
            </h2>
            <button
              @click="resetWorkflow"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              リセット
            </button>
          </div>
          
          <div class="flex items-center space-x-2">
            <div
              v-for="step in 6"
              :key="step"
              class="flex-1"
            >
              <div class="relative">
                <div
                  class="h-2 rounded-full transition-colors"
                  :class="currentStep >= step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
                />
                <div
                  class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors"
                  :class="currentStep >= step 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'"
                />
              </div>
              <p class="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                {{ stepLabels[step - 1] }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step Content -->
      <div class="max-w-4xl mx-auto">
        <component
          :is="currentStepComponent"
          @next="nextStep"
          @previous="previousStep"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useArticleStore } from '../stores/article'
import { useRouter } from 'vue-router'

const articleStore = useArticleStore()
const router = useRouter()

const currentStep = computed(() => articleStore.currentStep)

const stepLabels = [
  'ジャンル',
  'テーマ',
  'アイデア',
  '草案',
  'まとめ',
  'エクスポート'
]

const currentStepComponent = computed(() => {
  switch (currentStep.value) {
    case 1:
      return defineAsyncComponent(() => import('../components/BlogWizard/GenreSelector.vue'))
    case 2:
      return defineAsyncComponent(() => import('../components/BlogWizard/ThemeSelector.vue'))
    case 3:
      return defineAsyncComponent(() => import('../components/BlogWizard/IdeaPicker.vue'))
    case 4:
      return defineAsyncComponent(() => import('../components/BlogWizard/DraftGenerator.vue'))
    case 5:
      return defineAsyncComponent(() => import('../components/BlogWizard/DraftCombiner.vue'))
    case 6:
      return defineAsyncComponent(() => import('../components/BlogWizard/ExportView.vue'))
    default:
      return null
  }
})

const nextStep = () => {
  articleStore.nextStep()
}

const previousStep = () => {
  articleStore.previousStep()
}

const resetWorkflow = () => {
  if (confirm('作成中の内容をリセットしてもよろしいですか？')) {
    articleStore.resetWorkflow()
  }
}
</script>