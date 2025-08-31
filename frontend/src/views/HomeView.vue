<template>
  <div class="min-h-screen relative bg-transparent">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-20 relative z-10">
      <div class="text-center mb-16">
        <div class="inline-block animate-float mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 via-accent-500 to-mint-500 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl shadow-primary-500/25">
            <!-- AI/Brain icon -->
            <svg class="w-12 h-12 text-white absolute top-2 left-2" fill="currentColor" viewBox="0 0 32 20">
              <path d="M8 6c-2.5 0-4.5 2-4.5 4.5 0 1.2 0.5 2.3 1.3 3.1C4.3 14.2 4 15.1 4 16c0 2.5 2 4.5 4.5 4.5h15c2.5 0 4.5-2 4.5-4.5 0-0.9-0.3-1.8-0.8-2.4 0.8-0.8 1.3-1.9 1.3-3.1C28.5 8 26.5 6 24 6c-1 0-1.9 0.3-2.6 0.8C20.6 6.3 19.8 6 19 6h-3c-0.8 0-1.6 0.3-2.4 0.8C12.9 6.3 12 6 11 6H8z"/>
            </svg>
            <!-- Pen icon -->
            <svg class="w-6 h-6 text-yellow-300 absolute bottom-2 right-2 transform rotate-45" fill="currentColor" viewBox="0 0 12 16">
              <rect x="4" y="0" width="2" height="12"/>
              <polygon points="4,12 6,12 5,16"/>
            </svg>
            <!-- Sparkles -->
            <div class="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div class="absolute top-4 right-6 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
          </div>
        </div>
        
        <h1 class="title-editorial text-6xl lg:text-7xl mb-6">
          <span class="text-gradient">AIBlogBoost</span>
        </h1>
        <p class="subtitle-editorial text-xl lg:text-2xl mb-4 max-w-2xl mx-auto">
          AIの力で魅力的なブログ記事を簡単作成
        </p>
        <p class="font-serif text-surface-500 dark:text-surface-400 text-lg max-w-xl mx-auto leading-relaxed">
          直感的な6ステップウィザードで、高品質なコンテンツをあなたの手で。
        </p>
      </div>
      
      <div class="max-w-5xl mx-auto">
        <div class="glass-card rounded-3xl p-8 lg:p-12 mb-12">
          <h2 class="title-editorial text-3xl lg:text-4xl text-center mb-12">
            6ステップで完璧な記事を作成
          </h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="step-card group cursor-pointer" v-for="(step, index) in steps" :key="index">
              <div class="step-indicator mb-4" :class="'pending'">
                {{ index + 1 }}
              </div>
              <h3 class="font-display font-semibold text-lg text-surface-800 dark:text-surface-200 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {{ step.title }}
              </h3>
              <p class="font-serif text-surface-600 dark:text-surface-400 leading-relaxed">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Gemini API Data Usage Notice -->
        <div class="w-full mt-12 mb-8">
          <div class="glass-card rounded-2xl p-8 border border-accent-200/30 dark:border-accent-700/30 bg-accent-50/30 dark:bg-accent-900/20">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-7 h-7 text-surface-700 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-left">
                <p class="font-display font-semibold text-surface-800 dark:text-accent-300 mb-3 text-lg">
                  AI処理に関する重要な情報
                </p>
                <p class="font-serif text-surface-700 dark:text-accent-400 text-base leading-relaxed">
                  このアプリはGoogle Gemini APIの無料版を使用しており、入力されたテキストがGoogleのAI改善に使用される場合があります。機密情報の入力は控えてください。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-8">
          <button
            @click="startCreating"
            class="btn-primary text-xl py-6 px-12 mb-6 relative overflow-hidden group"
          >
            <span class="relative z-10">記事作成を開始</span>
            <div class="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-mint-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
          
          <div v-if="!isApiKeyConfigured" class="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-2xl text-sm font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            最初にAPIキーの設定が必要です
          </div>
        </div>
        
        <div v-if="recentArticles.length > 0" class="mt-20">
          <h3 class="title-editorial text-2xl lg:text-3xl text-center mb-8">
            最近作成した記事
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="article in recentArticles"
              :key="article.id"
              class="glass-card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              @click="viewArticle(article.id)"
            >
              <h4 class="font-display font-semibold text-surface-800 dark:text-surface-200 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ article.title }}
              </h4>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg">
                  {{ article.genre }}
                </span>
                <span class="px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-medium rounded-lg">
                  {{ formatDate(article.createdAt) }}
                </span>
              </div>
              <p class="font-serif text-surface-600 dark:text-surface-400 text-sm line-clamp-2">
                {{ article.theme }}
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
const recentArticles = computed(() => historyStore.recentArticles.slice(0, 6))

const steps = [
  {
    title: 'ジャンルを選択',
    description: 'ビジネス、技術、ライフスタイルなど9つのカテゴリから選択。カスタムジャンルも対応。'
  },
  {
    title: 'テーマを定義',
    description: '具体的なトピック、ターゲット読者、希望文字数を指定してコンテンツの方向性を決める。'
  },
  {
    title: 'アイデアを選択',
    description: 'AIが生成する5つのアイデアから最大3つまで選択し、優先度を設定して組み合わせる。'
  },
  {
    title: '草案を作成',
    description: 'プロフェッショナル、カジュアル、教育的な3つの異なるトーンで草案を生成。'
  },
  {
    title: '記事を結合',
    description: '各草案の最適な部分をインテリジェントに組み合わせ、カスタム指示で完成度を高める。'
  },
  {
    title: 'エクスポート',
    description: 'Markdown、HTML、テキスト形式でダウンロードし、ローカル履歴に自動保存。'
  }
]

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