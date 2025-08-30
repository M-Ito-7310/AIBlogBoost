<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 2: テーマを選択
    </h2>
    
    <div class="mb-6">
      <p class="text-gray-600 dark:text-gray-300 mb-2">
        選択したジャンル: <span class="font-semibold">{{ selectedGenre }}</span>
      </p>
      <p class="text-gray-600 dark:text-gray-300">
        記事の具体的なテーマを入力してください。
      </p>
    </div>
    
    <div class="space-y-4 mb-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          テーマ *
        </label>
        <input
          v-model="theme"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="例: リモートワークの生産性向上術"
          @keyup.enter="proceedToNext"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ターゲット読者（オプション）
        </label>
        <input
          v-model="targetAudience"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="例: 20-30代のビジネスパーソン"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          記事の目的（オプション）
        </label>
        <textarea
          v-model="purpose"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="例: 読者にリモートワークでの効率的な働き方を伝え、実践的なテクニックを提供する"
        />
      </div>
    </div>
    
    <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 テーマ選びのヒント</h3>
      <ul class="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400">
        <li>具体的で明確なテーマを設定しましょう</li>
        <li>読者が抱える問題や関心事を考慮しましょう</li>
        <li>トレンドや季節性も意識すると良いでしょう</li>
      </ul>
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
        :disabled="!theme.trim()"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        次へ（アイデア生成）
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useArticleStore } from '../../stores/article'

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const selectedGenre = computed(() => articleStore.selectedGenre)
const theme = ref(articleStore.selectedTheme || '')
const targetAudience = ref('')
const purpose = ref('')

const proceedToNext = () => {
  if (!theme.value.trim()) return
  
  // Combine theme with additional context if provided
  let fullTheme = theme.value
  if (targetAudience.value) {
    fullTheme += ` （ターゲット: ${targetAudience.value}）`
  }
  if (purpose.value) {
    fullTheme += ` 目的: ${purpose.value}`
  }
  
  articleStore.setTheme(fullTheme)
  emit('next')
}
</script>