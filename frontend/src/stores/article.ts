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
    // Clear cache when article is finalized as it will be saved to history
    clearCache()
  }
  
  // Cache management
  const CACHE_KEY = 'aibl_temp_article'
  
  const saveToCache = () => {
    const cacheData = {
      currentStep: currentStep.value,
      selectedGenre: selectedGenre.value,
      selectedTheme: selectedTheme.value,
      textLength: textLength.value,
      customTextLength: customTextLength.value,
      generatedIdeas: generatedIdeas.value,
      selectedIdea: selectedIdea.value,
      generatedDrafts: generatedDrafts.value,
      finalArticle: finalArticle.value,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  }
  
  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const data = JSON.parse(cached)
        currentStep.value = data.currentStep || 1
        selectedGenre.value = data.selectedGenre || ''
        selectedTheme.value = data.selectedTheme || ''
        textLength.value = data.textLength || '2000-3000'
        customTextLength.value = data.customTextLength || ''
        generatedIdeas.value = data.generatedIdeas || []
        selectedIdea.value = data.selectedIdea || null
        generatedDrafts.value = data.generatedDrafts || []
        finalArticle.value = data.finalArticle || null
        return true
      }
    } catch (error) {
      console.error('Failed to load cached article:', error)
    }
    return false
  }
  
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
  }
  
  const hasCachedData = () => {
    return localStorage.getItem(CACHE_KEY) !== null
  }
  
  const hasProgressData = () => {
    // Don't save if already at Step 6 (Export) - it should be saved to history instead
    if (currentStep.value >= 6) {
      return false
    }
    
    return currentStep.value > 1 || 
           selectedGenre.value !== '' || 
           selectedTheme.value !== '' ||
           generatedIdeas.value.length > 0 ||
           generatedDrafts.value.length > 0 ||
           finalArticle.value !== null
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
    setFinalArticle,
    
    // Cache actions
    saveToCache,
    loadFromCache,
    clearCache,
    hasCachedData,
    hasProgressData
  }
})