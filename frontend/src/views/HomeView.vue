<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          AIBlogBoost
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          AIの力で魅力的なブログ記事を簡単作成
        </p>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            6ステップで完璧な記事を作成
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">ジャンルを選択</h3>
                <p class="text-gray-600 dark:text-gray-300">ビジネス、技術、ライフスタイルなど</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">テーマを選択</h3>
                <p class="text-gray-600 dark:text-gray-300">具体的なトピックを設定</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">アイデアをピックアップ</h3>
                <p class="text-gray-600 dark:text-gray-300">AIが5つのアイデアを提案</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">草案を作成</h3>
                <p class="text-gray-600 dark:text-gray-300">3つの異なるトーンで草案生成</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">記事をまとめる</h3>
                <p class="text-gray-600 dark:text-gray-300">良い部分を組み合わせて完成</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-white">エクスポート</h3>
                <p class="text-gray-600 dark:text-gray-300">Markdown、HTML、テキスト形式で保存</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <button
            @click="startCreating"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transform transition hover:scale-105"
          >
            記事作成を開始
          </button>
          
          <div v-if="!isApiKeyConfigured" class="mt-4 text-sm text-red-600 dark:text-red-400">
            ※ 最初にAPIキーの設定が必要です
          </div>
        </div>
        
        <div v-if="recentArticles.length > 0" class="mt-12">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            最近作成した記事
          </h3>
          <div class="space-y-2">
            <div
              v-for="article in recentArticles"
              :key="article.id"
              class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
              @click="viewArticle(article.id)"
            >
              <h4 class="font-semibold text-gray-800 dark:text-white">{{ article.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ article.genre }} • {{ article.theme }} • {{ formatDate(article.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../stores/settings'
import { useHistoryStore } from '../stores/history'

const router = useRouter()
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()

const isApiKeyConfigured = computed(() => settingsStore.isApiKeyConfigured)
const recentArticles = computed(() => historyStore.recentArticles.slice(0, 3))

const startCreating = () => {
  if (isApiKeyConfigured.value) {
    router.push('/create')
  } else {
    router.push('/settings')
  }
}

const viewArticle = (id: string) => {
  router.push(`/history#${id}`)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ja-JP')
}
</script>