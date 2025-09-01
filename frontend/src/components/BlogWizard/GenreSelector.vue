<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Step 1: ジャンルを選択
    </h2>
    
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      ブログ記事のジャンルを選択してください。選択したジャンルに基づいて、最適な記事構成を提案します。
    </p>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <button
        v-for="genre in genres"
        :key="genre.id"
        @click="selectGenre(genre)"
        class="p-4 border-2 rounded-lg transition hover:shadow-lg"
        :class="selectedGenre === genre.id 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'"
      >
        <div class="text-3xl mb-2">{{ genre.emoji }}</div>
        <div class="font-semibold text-gray-800 dark:text-white">{{ genre.name }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ genre.description }}</div>
      </button>
    </div>
    
    <div v-if="selectedGenre === 'other'" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        カスタムジャンル *
      </label>
      <input
        v-model="customGenre"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder="例: スポーツ、料理、ペットなど"
        required
      />
    </div>
    
    <div class="flex justify-end">
      <button
        @click="proceedToNext"
        :disabled="!selectedGenre || (selectedGenre === 'other' && !customGenre.trim())"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        次へ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../../stores/article'

const emit = defineEmits(['next', 'previous'])
const articleStore = useArticleStore()

const genres = [
  {
    id: 'business',
    name: 'ビジネス',
    emoji: '💼',
    description: '起業、経営、マーケティング'
  },
  {
    id: 'technology',
    name: 'テクノロジー',
    emoji: '💻',
    description: 'IT、プログラミング、AI'
  },
  {
    id: 'lifestyle',
    name: 'ライフスタイル',
    emoji: '🌟',
    description: '健康、美容、ファッション'
  },
  {
    id: 'education',
    name: '教育',
    emoji: '📚',
    description: '学習、スキル、資格'
  },
  {
    id: 'entertainment',
    name: 'エンタメ',
    emoji: '🎬',
    description: '映画、音楽、ゲーム'
  },
  {
    id: 'finance',
    name: '金融',
    emoji: '💰',
    description: '投資、節約、資産運用'
  },
  {
    id: 'health',
    name: '健康',
    emoji: '🏃',
    description: 'フィットネス、栄養、医療'
  },
  {
    id: 'travel',
    name: '旅行',
    emoji: '✈️',
    description: '観光、グルメ、文化'
  },
  {
    id: 'other',
    name: 'その他',
    emoji: '📝',
    description: 'カスタムジャンル'
  }
]

const selectedGenre = ref('')
const customGenre = ref('')

// Initialize selection state when component mounts
onMounted(() => {
  const storedGenre = articleStore.selectedGenre
  if (storedGenre) {
    // Check if stored genre matches one of our predefined genres
    const matchingGenre = genres.find(g => g.name === storedGenre || g.id === storedGenre)
    if (matchingGenre) {
      selectedGenre.value = matchingGenre.id
    } else {
      // It's a custom genre, set "other" as selected and put the custom text
      selectedGenre.value = 'other'
      customGenre.value = storedGenre
    }
  }
})

const selectGenre = (genre: typeof genres[0]) => {
  selectedGenre.value = genre.id
  // Clear custom genre when selecting a different genre
  if (genre.id !== 'other') {
    customGenre.value = ''
  }
}

const proceedToNext = () => {
  if (!selectedGenre.value) {
    alert('ジャンルを選択してください')
    return
  }
  
  // Validate custom genre input when "other" is selected
  if (selectedGenre.value === 'other' && !customGenre.value.trim()) {
    alert('カスタムジャンルを入力してください')
    return
  }
  
  const finalGenre = customGenre.value || selectedGenre.value
  const genreName = customGenre.value || 
    genres.find(g => g.id === selectedGenre.value)?.name || 
    selectedGenre.value
    
  articleStore.setGenre(genreName)
  articleStore.setGenreId(selectedGenre.value)
  emit('next')
}
</script>