import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogArticle } from './article'

export interface SavedArticle extends BlogArticle {
  id: string
  savedAt: Date
  isFavorite: boolean
}

export const useHistoryStore = defineStore('history', () => {
  const articles = ref<SavedArticle[]>([])
  
  // Initialize from localStorage
  const initialize = () => {
    const saved = localStorage.getItem('article_history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        articles.value = parsed.map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          savedAt: new Date(article.savedAt)
        }))
      } catch (error) {
        console.error('Failed to load article history:', error)
      }
    }
  }
  
  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('article_history', JSON.stringify(articles.value))
  }
  
  // Add article
  const addArticle = (article: BlogArticle): SavedArticle => {
    const savedArticle: SavedArticle = {
      ...article,
      id: Date.now().toString(),
      savedAt: new Date(),
      isFavorite: false
    }
    articles.value.unshift(savedArticle)
    saveToStorage()
    return savedArticle
  }
  
  // Remove article
  const removeArticle = (id: string) => {
    const index = articles.value.findIndex(a => a.id === id)
    if (index !== -1) {
      articles.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const article = articles.value.find(a => a.id === id)
    if (article) {
      article.isFavorite = !article.isFavorite
      saveToStorage()
    }
  }
  
  // Get article by ID
  const getArticle = (id: string) => {
    return articles.value.find(a => a.id === id)
  }
  
  // Computed
  const favoriteArticles = computed(() => 
    articles.value.filter(a => a.isFavorite)
  )
  
  const recentArticles = computed(() => 
    articles.value.slice(0, 5)
  )
  
  const articleCount = computed(() => articles.value.length)
  
  // Initialize on store creation
  initialize()
  
  return {
    articles,
    favoriteArticles,
    recentArticles,
    articleCount,
    addArticle,
    removeArticle,
    toggleFavorite,
    getArticle
  }
})