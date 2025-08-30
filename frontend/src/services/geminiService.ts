import { GoogleGenerativeAI } from '@google/generative-ai'
import type { BlogIdea, BlogDraft } from '../stores/article'

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
  
  async generateIdeas(genre: string, theme: string): Promise<BlogIdea[]> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
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
          id: `idea-${index + 1}`,
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
  
  async generateDrafts(idea: BlogIdea): Promise<BlogDraft[]> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const tones = ['プロフェッショナル', 'カジュアル', '教育的']
    const drafts: BlogDraft[] = []
    const maxRetries = 2
    
    for (let i = 0; i < tones.length; i++) {
      let retryCount = 0
      let success = false
      
      while (retryCount < maxRetries && !success) {
        const prompt = `
以下のブログアイデアに基づいて、${tones[i]}なトーンで記事の草案を作成してください。

タイトル: ${idea.title}
説明: ${idea.description}
キーワード: ${idea.keywords.join(', ')}

以下の構成で作成してください：
1. 記事タイトル（キャッチーに改良可）
2. アウトライン（見出しのリスト）
3. 本文（1500-2000文字）

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
              id: `draft-${i + 1}`,
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
              id: `draft-${i + 1}`,
              title: `${idea.title}（${tones[i]}版）`,
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
  
  async combineDrafts(drafts: BlogDraft[], instructions: string): Promise<string> {
    if (!this.model) throw new Error('Gemini API not initialized')
    
    const draftsText = drafts.map((draft, index) => 
      `草案${index + 1}（${draft.tone}）:\n${draft.content}`
    ).join('\n\n---\n\n')
    
    const prompt = `
以下の複数の草案を参考に、指示に従って1つの完成した記事を作成してください。

指示: ${instructions || '各草案の良い部分を組み合わせて、バランスの取れた記事を作成してください。'}

草案:
${draftsText}

完成した記事を作成してください（2000-3000文字）。見出しを適切に使用し、読みやすい構成にしてください。
`
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error combining drafts:', error)
      throw error
    }
  }
}

export const geminiService = new GeminiService()