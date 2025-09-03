interface StatsData {
  totalEvents: number;
  apiCalls: number;
  articlesCreated: number;
  uniqueSessions: number;
}

interface TrackEventPayload {
  event_type: 'api_call' | 'article_created' | 'page_view';
  genre?: string;
  metadata?: Record<string, any>;
  session_id?: string;
}

class StatsService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_STATS_API_URL || 'http://localhost:3001';
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('aib_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('aib_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  async trackEvent(payload: TrackEventPayload): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        console.warn('Stats tracking failed:', response.status);
      }
    } catch (error) {
      console.warn('Stats service error:', error);
    }
  }

  async getStats(timeframe: string = '24h'): Promise<StatsData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats/summary?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      return {
        totalEvents: data.totals?.total_events || 0,
        apiCalls: data.totals?.api_calls || 0,
        articlesCreated: data.totals?.articles_created || 0,
        uniqueSessions: data.totals?.unique_sessions || 0
      };
    } catch (error) {
      console.warn('Failed to load stats:', error);
      return null;
    }
  }

  trackPageView(): void {
    this.trackEvent({ event_type: 'page_view' });
  }

  trackApiCall(genre?: string, metadata?: Record<string, any>): void {
    this.trackEvent({ 
      event_type: 'api_call',
      genre,
      metadata
    });
  }

  trackArticleCreated(genre: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      event_type: 'article_created',
      genre,
      metadata
    });
  }
}

export const statsService = new StatsService();
export type { StatsData, TrackEventPayload };