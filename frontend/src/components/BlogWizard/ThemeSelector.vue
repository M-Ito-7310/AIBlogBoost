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
          :placeholder="dynamicPlaceholders.theme"
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
          :placeholder="dynamicPlaceholders.targetAudience"
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
          :placeholder="dynamicPlaceholders.purpose"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          記事の文字数 *
        </label>
        <select
          v-model="textLength"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="1000">1000文字</option>
          <option value="2000-3000">2000～3000文字</option>
          <option value="4000-5000">4000～5000文字</option>
          <option value="custom">カスタム</option>
        </select>
      </div>
      
      <div v-if="textLength === 'custom'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          希望文字数
        </label>
        <input
          v-model="customTextLength"
          type="number"
          min="500"
          max="10000"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="例: 3500"
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
const selectedGenreId = computed(() => articleStore.selectedGenreId)
const theme = ref(articleStore.selectedTheme || '')
const targetAudience = ref('')
const purpose = ref('')
const textLength = ref(articleStore.textLength || '2000-3000')
const customTextLength = ref(articleStore.customTextLength || '')

// Genre-specific placeholder examples
const genrePlaceholders: Record<string, {theme: string, targetAudience: string, purpose: string}> = {
  business: {
    theme: '例: リモートワークの生産性向上術',
    targetAudience: '例: 20-30代のビジネスパーソン',
    purpose: '例: 読者にリモートワークでの効率的な働き方を伝え、実践的なテクニックを提供する'
  },
  technology: {
    theme: '例: ChatGPTを活用したプログラミング効率化',
    targetAudience: '例: エンジニア・開発者',
    purpose: '例: AI技術を使った開発効率の向上方法を具体的に解説する'
  },
  lifestyle: {
    theme: '例: 30代からの健康的な生活習慣作り',
    targetAudience: '例: 健康意識の高い30-40代',
    purpose: '例: 忙しい現代人でも続けられる健康習慣を紹介し、実践につなげる'
  },
  education: {
    theme: '例: 社会人のための効果的な英語学習法',
    targetAudience: '例: 英語を学び直したい社会人',
    purpose: '例: 忙しい社会人でも継続できる英語学習の方法を具体的に提案する'
  },
  entertainment: {
    theme: '例: 2024年注目のアニメ作品レビュー',
    targetAudience: '例: アニメファン・エンタメ好き',
    purpose: '例: 最新アニメの魅力を伝え、視聴の参考になる情報を提供する'
  },
  travel: {
    theme: '例: 一人旅初心者のための国内旅行ガイド',
    targetAudience: '例: 一人旅に興味がある20-30代',
    purpose: '例: 一人旅の魅力と安全に楽しむためのコツを分かりやすく解説する'
  },
  finance: {
    theme: '例: 20代から始める資産運用の基本',
    targetAudience: '例: 投資初心者の20-30代',
    purpose: '例: 投資の基礎知識から実践的な資産運用方法まで分かりやすく説明する'
  },
  health: {
    theme: '例: デスクワーカーのための肩こり解消法',
    targetAudience: '例: 肩こりに悩むオフィスワーカー',
    purpose: '例: デスクワークによる肩こりの原因と効果的な解消方法を紹介する'
  },
  other: {
    theme: '例: あなたの専門分野に関する興味深いトピック',
    targetAudience: '例: そのトピックに関心を持つ読者層',
    purpose: '例: 読者に新しい知識や視点を提供し、行動につながる情報を伝える'
  }
}

const dynamicPlaceholders = computed(() => {
  const genreId = selectedGenreId.value || 'other'
  return genrePlaceholders[genreId] || genrePlaceholders.other
})

const proceedToNext = () => {
  if (!theme.value.trim()) return
  
  // Validate custom text length if selected
  if (textLength.value === 'custom' && (!customTextLength.value || customTextLength.value < 500)) {
    alert('カスタム文字数を500文字以上で入力してください。')
    return
  }
  
  // Combine theme with additional context if provided
  let fullTheme = theme.value
  if (targetAudience.value) {
    fullTheme += ` （ターゲット: ${targetAudience.value}）`
  }
  if (purpose.value) {
    fullTheme += ` 目的: ${purpose.value}`
  }
  
  articleStore.setTheme(fullTheme)
  articleStore.setTextLength(textLength.value, customTextLength.value)
  emit('next')
}
</script>