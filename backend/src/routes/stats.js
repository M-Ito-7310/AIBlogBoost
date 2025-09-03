const express = require('express');
const Joi = require('joi');
const crypto = require('crypto');
const { getDatabase } = require('../utils/initDatabase');

const router = express.Router();

const trackEventSchema = Joi.object({
  event_type: Joi.string().valid('api_call', 'article_created', 'page_view').required(),
  genre: Joi.string().optional(),
  metadata: Joi.object().optional(),
  session_id: Joi.string().optional()
});

function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + process.env.API_SECRET || 'default-salt').digest('hex').substring(0, 16);
}

function hashUserAgent(userAgent) {
  return crypto.createHash('sha256').update(userAgent + process.env.API_SECRET || 'default-salt').digest('hex').substring(0, 16);
}

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

router.post('/track', async (req, res) => {
  try {
    const { error, value } = trackEventSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details
      });
    }

    const db = getDatabase();
    
    try {
      const { event_type, genre, metadata } = value;
      let { session_id } = value;

      if (!session_id) {
        session_id = generateSessionId();
      }

      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      
      const ipHash = process.env.ENABLE_IP_TRACKING === 'true' ? hashIP(ip) : null;
      const userAgentHash = hashUserAgent(userAgent);

      const insertStmt = db.prepare(`
        INSERT INTO usage_stats (session_id, event_type, genre, metadata, ip_hash, user_agent_hash)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        session_id,
        event_type,
        genre,
        metadata ? JSON.stringify(metadata) : null,
        ipHash,
        userAgentHash
      );

      const upsertSessionStmt = db.prepare(`
        INSERT INTO sessions (session_id, first_seen, last_seen, total_api_calls, total_articles, ip_hash, user_agent_hash)
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
          last_seen = CURRENT_TIMESTAMP,
          total_api_calls = total_api_calls + CASE WHEN ? = 'api_call' THEN 1 ELSE 0 END,
          total_articles = total_articles + CASE WHEN ? = 'article_created' THEN 1 ELSE 0 END
      `);

      upsertSessionStmt.run(
        session_id,
        event_type === 'api_call' ? 1 : 0,
        event_type === 'article_created' ? 1 : 0,
        ipHash,
        userAgentHash,
        event_type,
        event_type
      );

      res.json({
        success: true,
        session_id: session_id,
        timestamp: new Date().toISOString()
      });

    } finally {
      db.close();
    }

  } catch (error) {
    console.error('Database error in /track:', error);
    res.status(500).json({
      error: 'Database error occurred',
      type: 'DatabaseError'
    });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    let timeCondition = '';
    switch(timeframe) {
      case '1h':
        timeCondition = "datetime(timestamp) >= datetime('now', '-1 hour')";
        break;
      case '24h':
        timeCondition = "datetime(timestamp) >= datetime('now', '-1 day')";
        break;
      case '7d':
        timeCondition = "datetime(timestamp) >= datetime('now', '-7 days')";
        break;
      case '30d':
        timeCondition = "datetime(timestamp) >= datetime('now', '-30 days')";
        break;
      default:
        timeCondition = "1=1";
    }

    const db = getDatabase();
    
    try {
      const summaryStmt = db.prepare(`
        SELECT 
          event_type,
          genre,
          COUNT(*) as count
        FROM usage_stats 
        WHERE ${timeCondition}
        GROUP BY event_type, genre
        ORDER BY count DESC
      `);

      const totalStmt = db.prepare(`
        SELECT 
          COUNT(*) as total_events,
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(CASE WHEN event_type = 'api_call' THEN 1 END) as api_calls,
          COUNT(CASE WHEN event_type = 'article_created' THEN 1 END) as articles_created,
          COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views
        FROM usage_stats 
        WHERE ${timeCondition}
      `);

      const hourlyStmt = db.prepare(`
        SELECT 
          strftime('%H', timestamp) as hour,
          COUNT(*) as count
        FROM usage_stats 
        WHERE ${timeCondition}
        GROUP BY strftime('%H', timestamp)
        ORDER BY hour
      `);

      const summary = summaryStmt.all();
      const totals = totalStmt.get();
      const hourlyData = hourlyStmt.all();

      res.json({
        timeframe,
        totals,
        summary,
        hourlyData,
        lastUpdated: new Date().toISOString()
      });

    } finally {
      db.close();
    }

  } catch (error) {
    console.error('Database error in /summary:', error);
    res.status(500).json({
      error: 'Database error occurred',
      type: 'DatabaseError'
    });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const db = getDatabase();
    
    try {
      const recentStmt = db.prepare(`
        SELECT 
          u.id,
          u.session_id,
          u.event_type,
          u.genre,
          u.timestamp,
          u.metadata
        FROM usage_stats u
        ORDER BY u.timestamp DESC
        LIMIT ? OFFSET ?
      `);

      const sessionStmt = db.prepare(`
        SELECT 
          session_id,
          first_seen,
          last_seen,
          total_api_calls,
          total_articles
        FROM sessions
        ORDER BY last_seen DESC
        LIMIT 20
      `);

      const statsStmt = db.prepare(`
        SELECT 
          date(timestamp) as date,
          COUNT(*) as total_events,
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(CASE WHEN event_type = 'api_call' THEN 1 END) as api_calls,
          COUNT(CASE WHEN event_type = 'article_created' THEN 1 END) as articles
        FROM usage_stats
        WHERE datetime(timestamp) >= datetime('now', '-30 days')
        GROUP BY date(timestamp)
        ORDER BY date DESC
      `);

      const recentEvents = recentStmt.all(limit, offset);
      const activeSessions = sessionStmt.all();
      const dailyStats = statsStmt.all();

      res.json({
        recentEvents,
        activeSessions,
        dailyStats,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        },
        lastUpdated: new Date().toISOString()
      });

    } finally {
      db.close();
    }

  } catch (error) {
    console.error('Database error in /admin:', error);
    res.status(500).json({
      error: 'Database error occurred',
      type: 'DatabaseError'
    });
  }
});

router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 90 } = req.query;
    
    const db = getDatabase();
    
    try {
      const cleanupStmt = db.prepare(`
        DELETE FROM usage_stats 
        WHERE datetime(timestamp) < datetime('now', '-${days} days')
      `);

      const result = cleanupStmt.run();

      res.json({
        success: true,
        deletedRecords: result.changes,
        timestamp: new Date().toISOString()
      });

    } finally {
      db.close();
    }

  } catch (error) {
    console.error('Database error in /cleanup:', error);
    res.status(500).json({
      error: 'Database error occurred',
      type: 'DatabaseError'
    });
  }
});

module.exports = router;