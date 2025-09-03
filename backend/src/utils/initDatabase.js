const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function initDatabase() {
  const dbDir = path.join(__dirname, '../../database');
  const dbPath = process.env.DB_PATH || path.join(dbDir, 'stats.sqlite');
  
  // Create database directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const db = new Database(dbPath);
  
  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');
  
  // Create usage_stats table
  const createUsageStatsTable = `
    CREATE TABLE IF NOT EXISTS usage_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK (event_type IN ('api_call', 'article_created', 'page_view')),
      genre TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT,
      ip_hash TEXT,
      user_agent_hash TEXT
    )
  `;
  
  // Create daily_stats table for aggregated data
  const createDailyStatsTable = `
    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      total_api_calls INTEGER DEFAULT 0,
      total_articles INTEGER DEFAULT 0,
      unique_sessions INTEGER DEFAULT 0,
      genre_breakdown TEXT, -- JSON string
      hourly_breakdown TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create sessions table for session tracking
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_api_calls INTEGER DEFAULT 0,
      total_articles INTEGER DEFAULT 0,
      ip_hash TEXT,
      user_agent_hash TEXT
    )
  `;
  
  try {
    // Execute table creation
    db.exec(createUsageStatsTable);
    db.exec(createDailyStatsTable);
    db.exec(createSessionsTable);
    
    console.log('✅ Database tables created successfully');
    
    // Create indices for better performance
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_usage_stats_date ON usage_stats(date(timestamp))',
      'CREATE INDEX IF NOT EXISTS idx_usage_stats_session_genre ON usage_stats(session_id, genre)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen)'
    ];
    
    indices.forEach(indexSql => {
      try {
        db.exec(indexSql);
      } catch (err) {
        // Index might already exist, ignore error
      }
    });
    
    // Check if database is working
    const testQuery = db.prepare('SELECT COUNT(*) as count FROM usage_stats');
    const result = testQuery.get();
    console.log(`📊 Current stats records: ${result.count}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Export for use in other modules
function getDatabase() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/stats.sqlite');
  return new Database(dbPath);
}

module.exports = {
  initDatabase,
  getDatabase
};