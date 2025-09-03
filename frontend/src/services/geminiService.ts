import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BlogIdea, BlogDraft, SelectedIdea } from '../stores/article'
import { useArticleStore } from '../stores/article'
import { statsService } from './statsService'

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  
  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }
  
  isInitialized(): boolean {
    return this.model !== null
  }
  
  private getTextLengthRequirement(): string {
    const articleStore = useArticleStore()
    const textLength = articleStore.textLength
    const customLength = articleStore.customTextLength
    
    if (textLength === 'custom' && customLength) {
      return `約${customLength}文字`
    } else if (textLength === '1000') {
      return '約1000文字'
    } else if (textLength === '2000-3000') {
      return '2000-3000文字'
    } else if (textLength === '4000-5000') {
      return '4000-5000文字'
    }
    
    return '1500-2000文字' // fallback
  }
  
  private getTargetWordCount(): { min: number; max: number } {
    const articleStore = useArticleStore()
    const textLength = articleStore.textLength
    const customLength = articleStore.customTextLength
    
    if (textLength === 'custom' && customLength) {
      const num = parseInt(customLength)
      return { min: Math.floor(num * 0.9), max: Math.ceil(num * 1.1) }
    } else if (textLength === '1000') {
      return { min: 900, max: 1100 }
    } else if (textLength === '2000-3000') {
      return { min: 2000, max: 3000 }
    } else if (textLength === '4000-5000') {
      return { min: 4000, max: 5000 }
    }
    
    return { min: 1500, max: 2000 } // fallback
  }
  
  async generateIdeas(genre: string, theme: string): Promise<BlogIdea[]> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    statsService.trackApiCall(genre, { action: 'generateIdeas' })
    
    const prompt = `
あなたはプロのブログライターです。以下のジャンルとテーマに基づいて、魅力的なブログ記事のアイデアを5つ提案してください。

ジャンル: ${genre}
テーマ: ${theme}

各アイデアには以下を含めてください：
1. 記事タイトル
2. 簡潔な説明（50-100文字）
3. 関連キーワード（3-5個）

JSON形式で回答してください：
[
  {
    "title": "タイトル",
    "description": "説明",
    "keywords": ["キーワード1", "キーワード2", "キーワード3"]
  }
]
`
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const ideas = JSON.parse(jsonMatch[0])
        return ideas.map((idea: any, index: number) => ({
          id: `idea-${Date.now()}-${index + 1}`,
          title: idea.title,
          description: idea.description,
          keywords: idea.keywords
        }))
      }
      
      throw new Error('Failed to parse response')
    } catch (error) {
      console.error('Error generating ideas:', error)
      throw error
    }
  }
  
  async generateSingleIdea(genre: string, theme: string, index: number): Promise<BlogIdea> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const prompt = `
あなたはプロのブログライターです。以下のジャンルとテーマに基づいて、魅力的なブログ記事のアイデアを1つ提案してください。

ジャンル: ${genre}
テーマ: ${theme}

アイデアには以下を含めてください：
1. 記事タイトル
2. 簡潔な説明（50-100文字）
3. 関連キーワード（3-5個）

JSON形式で回答してください：
{
  "title": "タイトル",
  "description": "説明",
  "keywords": ["キーワード1", "キーワード2", "キーワード3"]
}
`
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const idea = JSON.parse(jsonMatch[0])
        return {
          id: `idea-${Date.now()}-${index}`,
          title: idea.title,
          description: idea.description,
          keywords: idea.keywords
        }
      }
      
      throw new Error('Failed to parse response')
    } catch (error) {
      console.error('Error generating single idea:', error)
      throw error
    }
  }
  
  async generateDrafts(idea: BlogIdea): Promise<BlogDraft[]> {
    // Legacy single idea support
    const selectedIdeas: SelectedIdea[] = [{ idea, priority: 1 }]
    return this.generateDraftsFromMultipleIdeas(selectedIdeas)
  }
  
  async generateDraftsFromMultipleIdeas(selectedIdeas: SelectedIdea[]): Promise<BlogDraft[]> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const articleStore = useArticleStore()
    statsService.trackApiCall(articleStore.genre, { action: 'generateDrafts', ideasCount: selectedIdeas.length })
    
    const tones = ['プロフェッショナル', 'カジュアル', '教育的']
    const drafts: BlogDraft[] = []
    const maxRetries = 2
    
    // Create combined ideas context
    const ideasContext = selectedIdeas.map(selected => 
      `優先度${selected.priority}: ${selected.idea.title} - ${selected.idea.description} (キーワード: ${selected.idea.keywords.join(', ')})`
    ).join('\n')
    
    for (let i = 0; i < tones.length; i++) {
      let retryCount = 0
      let success = false
      
      while (retryCount < maxRetries && !success) {
        const textLengthReq = this.getTextLengthRequirement()
        const prompt = `
以下の複数のブログアイデアを組み合わせて、${tones[i]}なトーンで記事の草案を作成してください。

選択されたアイデア（優先度順）:
${ideasContext}

以下の構成で作成してください：
1. 記事タイトル（キャッチーに改良可）
2. アウトライン（見出しのリスト）
3. 本文（${textLengthReq}）

必ずJSON形式で回答してください。JSONの前後に説明文を入れないでください：
{
  "title": "記事タイトル",
  "outline": ["見出し1", "見出し2", "見出し3"],
  "content": "本文",
  "tone": "${tones[i]}"
}
`
        
        try {
          console.log(`Generating ${tones[i]} draft (attempt ${retryCount + 1})...`)
          const result = await this.model.generateContent(prompt)
          const response = await result.response
          const text = response.text()
          
          // Try to extract JSON - be more flexible with the regex
          let jsonStr = text
          
          // First, try to find JSON object
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            jsonStr = jsonMatch[0]
          }
          
          // Clean up common issues
          jsonStr = jsonStr
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
          
          try {
            const draft = JSON.parse(jsonStr)
            
            // Validate required fields
            if (!draft.title || !draft.content || !draft.outline) {
              throw new Error('Missing required fields in draft')
            }
            
            drafts.push({
              id: `draft-${Date.now()}-${i + 1}`,
              title: draft.title || `${tones[i]}な記事タイトル`,
              content: draft.content || '',
              outline: Array.isArray(draft.outline) ? draft.outline : [],
              tone: draft.tone || tones[i]
            })
            success = true
            console.log(`Successfully generated ${tones[i]} draft`)
          } catch (parseError) {
            console.error(`Failed to parse JSON for ${tones[i]} draft:`, parseError)
            throw parseError
          }
        } catch (error) {
          console.error(`Error generating ${tones[i]} draft (attempt ${retryCount + 1}):`, error)
          retryCount++
          
          if (retryCount >= maxRetries) {
            console.error(`Failed to generate ${tones[i]} draft after ${maxRetries} attempts`)
            // Create a fallback draft instead of completely failing
            drafts.push({
              id: `draft-${Date.now()}-${i + 1}`,
              title: `複数アイデア組み合わせ記事（${tones[i]}版）`,
              content: `[${tones[i]}トーンの草案生成に失敗しました。再度お試しください。]`,
              outline: ['はじめに', '本文', 'まとめ'],
              tone: tones[i]
            })
            success = true // Move to next tone
          } else {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
    }
    
    // Check if we have at least one valid draft (not a fallback)
    const validDrafts = drafts.filter(d => !d.content.includes('草案生成に失敗しました'))
    if (validDrafts.length === 0) {
      throw new Error('Failed to generate any valid drafts. Please check your API key and try again.')
    }
    
    return drafts
  }
  
  async generateSingleDraft(idea: BlogIdea, tone: string, index: number): Promise<BlogDraft> {
    // Legacy single idea support
    const selectedIdeas: SelectedIdea[] = [{ idea, priority: 1 }]
    return this.generateSingleDraftFromMultipleIdeas(selectedIdeas, tone, index)
  }
  
  async generateSingleDraftFromMultipleIdeas(selectedIdeas: SelectedIdea[], tone: string, index: number): Promise<BlogDraft> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const maxRetries = 2
    let retryCount = 0
    
    // Create combined ideas context
    const ideasContext = selectedIdeas.map(selected => 
      `優先度${selected.priority}: ${selected.idea.title} - ${selected.idea.description} (キーワード: ${selected.idea.keywords.join(', ')})`
    ).join('\n')
    
    while (retryCount < maxRetries) {
      const textLengthReq = this.getTextLengthRequirement()
      const prompt = `
以下の複数のブログアイデアを組み合わせて、${tone}なトーンで記事の草案を作成してください。

選択されたアイデア（優先度順）:
${ideasContext}

以下の構成で作成してください：
1. 記事タイトル（キャッチーに改良可）
2. アウトライン（見出しのリスト）
3. 本文（${textLengthReq}）

必ずJSON形式で回答してください。JSONの前後に説明文を入れないでください：
{
  "title": "記事タイトル",
  "outline": ["見出し1", "見出し2", "見出し3"],
  "content": "本文",
  "tone": "${tone}"
}
`
      
      try {
        console.log(`Regenerating ${tone} draft (attempt ${retryCount + 1})...`)
        const result = await this.model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        // Try to extract JSON
        let jsonStr = text
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonStr = jsonMatch[0]
        }
        
        jsonStr = jsonStr
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()
        
        const draft = JSON.parse(jsonStr)
        
        if (!draft.title || !draft.content || !draft.outline) {
          throw new Error('Missing required fields in draft')
        }
        
        console.log(`Successfully regenerated ${tone} draft`)
        return {
          id: `draft-${Date.now()}-${index}`,
          title: draft.title || `${tone}な記事タイトル`,
          content: draft.content || '',
          outline: Array.isArray(draft.outline) ? draft.outline : [],
          tone: draft.tone || tone
        }
      } catch (error) {
        console.error(`Error regenerating ${tone} draft (attempt ${retryCount + 1}):`, error)
        retryCount++
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to regenerate ${tone} draft after ${maxRetries} attempts`)
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    throw new Error(`Failed to regenerate ${tone} draft`)
  }
  
  async combineDrafts(drafts: BlogDraft[], instructions: string): Promise<{content: string, seoKeywords: string[]}> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const articleStore = useArticleStore()
    statsService.trackApiCall(articleStore.genre, { action: 'combineDrafts', draftsCount: drafts.length })
    
    const draftsText = drafts.map((draft, index) => 
      `草案${index + 1}（${draft.tone}）:\n${draft.content}`
    ).join('\n\n---\n\n')
    
    const textLengthReq = this.getTextLengthRequirement()
    const targetLength = this.getTargetWordCount()
    const maxRetries = 2
    let retryCount = 0
    
    while (retryCount < maxRetries) {
      const prompt = `
以下の複数の草案を参考に、指示に従って1つの完成した記事を作成してください。

指示: ${instructions || '各草案の良い部分を組み合わせて、バランスの取れた記事を作成してください。'}

草案:
${draftsText}

【重要な文字数要件】
必ず${textLengthReq}で作成してください。
最小${targetLength.min}文字、最大${targetLength.max}文字の範囲内で作成してください。

【文字数を満たすための指針】
1. 各セクションを十分に詳しく説明する
2. 具体例や事例を複数含める
3. 背景情報や補足説明を充実させる
4. 実践的なアドバイスや提案を詳細に記載する
5. まとめや結論部分も充実させる

見出しを適切に使用し、読みやすい構成にしてください。
内容の質を保ちながら、指定された文字数を必ず満たしてください。

また、以下のJSON形式で、記事とSEOキーワードを出力してください：

{
  "content": "記事の本文をここに...",
  "seoKeywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"]
}

SEOキーワードは記事の内容に関連する検索されやすい5つのキーワードを選んでください。
`
      
      try {
        console.log(`Generating combined article (attempt ${retryCount + 1})...`)
        console.log(`Target length: ${targetLength.min}-${targetLength.max} characters`)
        
        const result = await this.model.generateContent(prompt)
        const response = await result.response
        const generatedText = response.text()
        
        // Try to parse JSON response
        try {
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            const content = parsed.content
            const seoKeywords = parsed.seoKeywords || []
            
            // Check if the generated content meets the length requirement
            const contentLength = content.length
            console.log(`Generated content length: ${contentLength} characters`)
            
            if (contentLength >= targetLength.min) {
              console.log('Content length requirement met')
              return { content, seoKeywords }
            } else {
              console.log(`Content too short (${contentLength} < ${targetLength.min}), retrying...`)
              retryCount++
              
              if (retryCount >= maxRetries) {
                console.warn(`Could not meet length requirement after ${maxRetries} attempts, returning best effort`)
                return { content, seoKeywords }
              }
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000))
              continue
            }
          }
        } catch (parseError) {
          console.log('Failed to parse JSON, treating as plain text')
          // Fallback to plain text
          const contentLength = generatedText.length
          console.log(`Generated text length: ${contentLength} characters`)
          
          if (contentLength >= targetLength.min) {
            console.log('Text length requirement met')
            return { content: generatedText, seoKeywords: [] }
          } else {
            console.log(`Text too short (${contentLength} < ${targetLength.min}), retrying...`)
            retryCount++
            
            if (retryCount >= maxRetries) {
              console.warn(`Could not meet length requirement after ${maxRetries} attempts, returning best effort`)
              return { content: generatedText, seoKeywords: [] }
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      } catch (error) {
        console.error(`Error combining drafts (attempt ${retryCount + 1}):`, error)
        retryCount++
        
        if (retryCount >= maxRetries) {
          throw error
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    throw new Error('Failed to generate combined article')
  }
}

export const geminiService = new GeminiService()