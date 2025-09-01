<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="relative w-full max-w-6xl max-h-[95vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              APIキーの設定方法
            </h2>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Progress indicator -->
          <div class="flex items-center justify-center mt-4 space-x-2">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="currentSlide = index"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                currentSlide === index 
                  ? 'w-8 bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              ]"
              :aria-label="`スライド ${index + 1}`"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto" style="max-height: calc(95vh - 180px)">
          <div class="p-6">
            <!-- Slide content -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ slides[currentSlide].title }}
              </h3>
              
              <!-- Image -->
              <div class="space-y-2">
                <div class="flex justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <img 
                    :src="slides[currentSlide].image" 
                    :alt="slides[currentSlide].title"
                    class="w-full h-auto rounded shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    style="max-height: 600px"
                    @click="openImageInNewTab(slides[currentSlide].image)"
                  />
                </div>
                <p class="text-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  画像をクリックすると拡大表示されます
                </p>
              </div>

              <!-- Description -->
              <div class="text-gray-700 dark:text-gray-300 space-y-2">
                <p v-for="(text, index) in slides[currentSlide].description" :key="index">
                  {{ text }}
                </p>
              </div>

              <!-- Special notes or actions -->
              <div v-if="slides[currentSlide].note" class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-blue-700 dark:text-blue-300">{{ slides[currentSlide].note }}</p>
                </div>
              </div>

              <!-- Action button -->
              <div v-if="slides[currentSlide].actionButton" class="mt-4">
                <a 
                  :href="slides[currentSlide].actionButton.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {{ slides[currentSlide].actionButton.text }}
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer with navigation -->
        <div class="sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <button
              @click="previousSlide"
              :disabled="currentSlide === 0"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentSlide === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
              ]"
            >
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                前へ
              </span>
            </button>

            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentSlide + 1 }} / {{ slides.length }}
            </span>

            <button
              v-if="currentSlide < slides.length - 1"
              @click="nextSlide"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <span class="flex items-center">
                次へ
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <button
              v-else
              @click="completeGuide"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <span class="flex items-center">
                設定画面へ
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Import images using URL constructor for Japanese filenames
const img1 = new URL('../assets/1.APIキー未設定.png', import.meta.url).href
const img2 = new URL('../assets/2.GoogleAISsudio_APIキーホーム画面.png', import.meta.url).href
const img3 = new URL('../assets/3.APIキー生成.png', import.meta.url).href
const img4 = new URL('../assets/4.GoogleAISsudio_APIキーホーム画面_APIキー生成後.png', import.meta.url).href
const img5 = new URL('../assets/5.APIキー設定.png', import.meta.url).href
const img6 = new URL('../assets/6.APIキー設定後.png', import.meta.url).href
const img7 = new URL('../assets/7.APIキー設定後_ホーム画面.png', import.meta.url).href

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const router = useRouter()

const currentSlide = ref(0)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const slides = [
  {
    title: 'ステップ1: APIキーが未設定の状態',
    image: img1,
    description: [
      'AIBlogBoostを使用するには、Google Gemini APIキーが必要です。',
      '現在、APIキーが設定されていないため、記事の作成ができません。',
      'これから、APIキーの取得と設定方法を順番に説明します。'
    ],
    note: 'APIキーは無料で取得でき、1日1,500回まで無料で利用できます。'
  },
  {
    title: 'ステップ2: Google AI Studioにアクセス',
    image: img2,
    description: [
      'Google AI Studioにアクセスして、APIキーを取得します。',
      '画面右上の「APIキーを作成」ボタンをクリックして、APIキーの生成画面に進みます。'
    ],
    note: 'Googleアカウントでのログインが必要です。',
    actionButton: {
      text: 'Google AI Studioを開く',
      url: 'https://makersuite.google.com/app/apikey'
    }
  },
  {
    title: 'ステップ3: APIキーを生成してコピー',
    image: img3,
    description: [
      '「APIキーを作成」ボタンをクリックして、新しいAPIキーを生成します。',
      '生成されたAPIキーが表示されたら、コピーボタンをクリックしてコピーしてください。'
    ],
    note: 'APIキーは他人と共有しないでください。セキュリティ上重要な情報です。'
  },
  {
    title: 'ステップ4: APIキーの管理について',
    image: img4,
    description: [
      '生成したAPIキーはGoogle AI Studioでいつでも確認できます。',
      'また、APIキーは複数作成することも可能です。',
      '不要になったAPIキーは、セキュリティのために削除することをお勧めします。'
    ],
    note: 'APIキーの使用状況や制限もGoogle AI Studioで確認できます。'
  },
  {
    title: 'ステップ5: APIキーを設定',
    image: img5,
    description: [
      'AIBlogBoostの設定画面に戻り、コピーしたAPIキーを貼り付けます。',
      '「APIキーを保存」ボタンをクリックして、APIキーを保存します。',
      'APIキーは暗号化されてブラウザに安全に保存されます。'
    ]
  },
  {
    title: 'ステップ6: 設定完了の確認',
    image: img6,
    description: [
      'APIキーが正常に設定されました。',
      '「APIキー設定済み」と表示されていることを確認してください。',
      'これで記事作成の準備が整いました。'
    ]
  },
  {
    title: 'ステップ7: 記事作成を開始',
    image: img7,
    description: [
      'ホーム画面に戻ると、画面右下が「APIキー設定済み」と表示され、記事作成が可能になっています。',
      '「記事作成を開始」ボタンをクリックして、AIを活用した記事作成を始めましょう。',
      '6つのステップで、高品質な記事を簡単に作成できます。'
    ],
    note: '設定したAPIキーはいつでも設定画面から変更・削除できます。'
  }
]

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  }
}

const close = () => {
  isOpen.value = false
}

const completeGuide = () => {
  close()
  router.push('/settings')
}

const openImageInNewTab = (imageSrc: string) => {
  window.open(imageSrc, '_blank')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Ensure modal is always on top */
:deep(.fixed) {
  z-index: 99999 !important;
}
</style>