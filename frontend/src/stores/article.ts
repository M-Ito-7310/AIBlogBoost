import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BlogIdea {
  id: string
  title: string
  description: string
  keywords: string[]
}

export interface BlogDraft {
  id: string
  title: string
  content: string
  outline: string[]
  tone: string
}

export interface BlogArticle {
  title: string
  content: string
  genre: string
  theme: string
  keywords: string[]
  createdAt: Date
}

export const useArticleStore = defineStore('article', () => {
  // Current step in the wizard (1-6)
  const currentStep = ref(1)
  
  // Step 1: Genre
  const selectedGenre = ref<string>('')
  
  // Step 2: Theme
  const selectedTheme = ref<string>('')
  const textLength = ref<string>('2000-3000')
  const customTextLength = ref<string>('')
  
  // Step 3: Ideas
  const generatedIdeas = ref<BlogIdea[]>([])
  const selectedIdea = ref<BlogIdea | null>(null)
  
  // Step 4: Drafts
  const generatedDrafts = ref<BlogDraft[]>([])
  
  // Step 5: Combined article
  const finalArticle = ref<BlogArticle | null>(null)
  
  // Navigation
  const nextStep = () => {
    if (currentStep.value < 6) {
      currentStep.value++
    }
  }
  
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      currentStep.value = step
    }
  }
  
  // Reset workflow
  const resetWorkflow = () => {
    currentStep.value = 1
    selectedGenre.value = ''
    selectedTheme.value = ''
    textLength.value = '2000-3000'
    customTextLength.value = ''
    generatedIdeas.value = []
    selectedIdea.value = null
    generatedDrafts.value = []
    finalArticle.value = null
  }
  
  // Step setters
  const setGenre = (genre: string) => {
    selectedGenre.value = genre
  }
  
  const setTheme = (theme: string) => {
    selectedTheme.value = theme
  }
  
  const setTextLength = (length: string, customLength?: string) => {
    textLength.value = length
    if (customLength) {
      customTextLength.value = customLength
    }
  }
  
  const setIdeas = (ideas: BlogIdea[]) => {
    generatedIdeas.value = ideas
  }
  
  const selectIdea = (idea: BlogIdea) => {
    selectedIdea.value = idea
  }
  
  const setDrafts = (drafts: BlogDraft[]) => {
    generatedDrafts.value = drafts
  }
  
  const setFinalArticle = (article: BlogArticle) => {
    finalArticle.value = article
  }
  
  return {
    // State
    currentStep,
    selectedGenre,
    selectedTheme,
    textLength,
    customTextLength,
    generatedIdeas,
    selectedIdea,
    generatedDrafts,
    finalArticle,
    
    // Actions
    nextStep,
    previousStep,
    goToStep,
    resetWorkflow,
    setGenre,
    setTheme,
    setTextLength,
    setIdeas,
    selectIdea,
    setDrafts,
    setFinalArticle
  }
})