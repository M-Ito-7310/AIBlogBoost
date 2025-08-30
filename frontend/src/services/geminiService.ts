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
    
    for (let i = 0; i < tones.length; i++) {
      const prompt = `
以下のブログアイデアに基づいて、${tones[i]}なトーンで記事の草案を作成してください。

タイトル: ${idea.title}
説明: ${idea.description}
キーワード: ${idea.keywords.join(', ')}

以下の構成で作成してください：
1. 記事タイトル（キャッチーに改良可）
2. アウトライン（見出しのリスト）
3. 本文（1500-2000文字）

JSON形式で回答してください：
{
  "title": "記事タイトル",
  "outline": ["見出し1", "見出し2", "見出し3"],
  "content": "本文",
  "tone": "${tones[i]}"
}
`
      
      try {
        const result = await this.model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const draft = JSON.parse(jsonMatch[0])
          drafts.push({
            id: `draft-${i + 1}`,
            title: draft.title,
            content: draft.content,
            outline: draft.outline,
            tone: draft.tone || tones[i]
          })
        }
      } catch (error) {
        console.error(`Error generating draft ${i + 1}:`, error)
      }
    }
    
    if (drafts.length === 0) {
      throw new Error('Failed to generate any drafts')
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