# AIBlogBoost 統計管理システム開発ロードマップ

## 📊 プロジェクト概要

AIBlogBoostにユーザー使用統計の収集・分析機能を追加し、API使用回数や記事作成傾向を把握できるシステムを構築する。

**目標**: フロントエンドのみの構成から、バックエンド統計システムを追加してデモサイトとしての価値を向上させる

---

## 🎯 Phase 1: ローカル開発環境構築 (1-2日)

### ✅ 完了項目
- [x] 要件定義・アーキテクチャ設計
- [x] バックエンド基盤構築 (Express + SQLite)
- [x] 基本API実装 (統計収集・取得)
- [x] フロントエンド統合 (イベント送信)
- [x] ホームページ統計カウンター表示 (訪問者数カウンター風)
- [x] ローカル環境テスト完了 (API動作確認済み)

### 技術スタック
- **Backend**: Node.js + Express.js + SQLite3 + better-sqlite3
- **Frontend**: 既存Vue.js + 新statsService
- **Development**: 並行起動 (Frontend:5173, Backend:3001)

### データベース設計
```sql
-- メイン統計テーブル
usage_stats (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  genre TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,
  ip_hash TEXT
)

-- 日次集計テーブル
daily_stats (
  date TEXT PRIMARY KEY,
  total_api_calls INTEGER DEFAULT 0,
  total_articles INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  genre_breakdown TEXT
)
```

### API設計
```
POST /api/stats/track      # 使用統計記録
GET  /api/stats/summary    # 集計データ取得 (ホームページ統計表示用)
GET  /api/stats/admin      # 管理用詳細データ (将来拡張用)
GET  /admin                # 管理画面HTML (将来拡張用)
```

### フロントエンド統計表示
- **統計カウンター**: ホームページヘロー部分に組み込み
- **表示項目**: 
  - 累計記事作成数 (総数)
  - 累計API使用回数 (総数)  
  - アクティブユーザー数 (24時間以内)
- **デザイン**: 訪問者数カウンター風の視覚的表示
- **更新**: ページ読み込み時 + リアルタイム更新なし（シンプル実装）

---

## 🚀 Phase 2: 本格デプロイ準備 (2-3日)

### さくらVPS デプロイ
- [ ] Ubuntu 22.04 環境セットアップ
- [ ] Node.js インストール・設定
- [ ] PM2 プロセス管理
- [ ] nginx リバースプロキシ設定
- [ ] SSL証明書 (Let's Encrypt)
- [ ] ファイアウォール設定

### デプロイ構成
```
Internet → nginx:80/443 → Express:3001 → SQLite
                     ↘ Static Files (Vue.js)
```

### セキュリティ対策
- [ ] CORS設定 (フロントエンドドメイン限定)
- [ ] Rate Limiting (API濫用防止)
- [ ] SQLインジェクション対策
- [ ] セッション管理・匿名化

---

## 📈 Phase 3: 機能拡張 (3-5日)

### 高度な分析機能
- [ ] リアルタイムダッシュボード
- [ ] グラフ・チャート表示 (Chart.js)
- [ ] エクスポート機能 (CSV, JSON)
- [ ] アラート機能 (使用量上限)

### パフォーマンス最適化
- [ ] データベースインデックス
- [ ] キャッシュ機能 (Redis or Memory)
- [ ] バッチ処理 (日次集計)
- [ ] ログローテーション

### 追加統計項目
- [ ] 記事品質スコア (文字数、SEOキーワード数)
- [ ] ユーザー行動分析 (ステップ離脱率)
- [ ] パフォーマンス統計 (レスポンス時間)
- [ ] エラー率追跡

---

## 🔧 Phase 4: 運用・保守 (継続)

### 監視・アラート
- [ ] システムヘルスチェック
- [ ] ディスク容量監視
- [ ] エラーログ監視
- [ ] バックアップ自動化

### スケーリング準備
- [ ] データベース移行準備 (PostgreSQL)
- [ ] ロードバランサー検討
- [ ] CDN統合検討
- [ ] マイクロサービス分割検討

---

## 💰 コスト分析

### Phase 1 (ローカル開発)
- **開発コスト**: ¥0 (既存環境利用)
- **時間コスト**: 1-2日

### Phase 2 (さくらVPS運用)
- **追加月額**: ¥0 (既存VPS利用)
- **SSL証明書**: ¥0 (Let's Encrypt)
- **ドメイン**: 既存利用

### Phase 3+ (機能拡張時)
- **Redis追加**: ¥0-500/月 (VPS内 or 外部)
- **監視ツール**: ¥0-1,000/月
- **CDN**: ¥0-500/月

### AWS移行時（参考）
- **Lambda + DynamoDB**: ¥100-500/月
- **CloudWatch**: ¥200-800/月
- **Route53**: ¥50/月

---

## 🎯 成功指標

### Phase 1完了時
- ✅ API使用回数の正確な記録
- ✅ 記事作成数の追跡
- ✅ ジャンル別統計の取得
- ✅ 基本管理画面の動作

### Phase 2完了時
- ✅ 本番環境での安定動作
- ✅ SSL化・セキュリティ対策完了
- ✅ 24/7 稼働実現

### Phase 3完了時
- ✅ 詳細分析機能
- ✅ パフォーマンス最適化
- ✅ 運用監視体制

---

## 🔄 技術的負債・改善点

### 既知の制約
- SQLite 同時書き込み制限
- 1GBメモリでのスケーリング限界
- ファイルベースDBのバックアップ課題

### 将来改善項目
- PostgreSQL移行
- Docker化
- CI/CD パイプライン
- API認証機能
- 多言語対応時の統計分離

---

## 📋 実装優先度

### 🔴 High Priority (Phase 1必須)
- 基本統計収集 (API使用・記事作成)
- 安全な匿名化処理
- 簡易管理画面

### 🟡 Medium Priority (Phase 2-3)
- リアルタイム表示
- 詳細分析機能
- パフォーマンス最適化

### 🟢 Low Priority (Phase 4+)
- 高度な機能
- スケーリング対応
- 外部サービス連携

---

## 📝 開発メモ

### 技術選択理由
- **SQLite**: 軽量、設定不要、ファイルベース
- **Express**: シンプル、高速開発、豊富なエコシステム
- **better-sqlite3**: 同期処理、高性能、型安全

### デプロイ戦略
1. **ローカル開発**: Windows環境での開発・テスト
2. **ステージング**: さくらVPS上での検証
3. **本番**: 同VPS上での安定運用

### 監視項目
- API レスポンス時間
- データベース サイズ
- エラー発生率
- 同時接続数

---

### 🎉 Phase 1 実装完了 (2025-09-03)

**実装済み機能:**
- ✅ Express サーバー (ポート3001) - セキュリティ対策済み
- ✅ SQLite データベース - 3テーブル構成 (usage_stats, daily_stats, sessions)
- ✅ 統計収集API - POST /api/stats/track
- ✅ 統計表示API - GET /api/stats/summary 
- ✅ フロントエンド統計カウンター - ホームページ組み込み済み
- ✅ 自動イベント追跡 - API使用・記事作成・ページ表示
- ✅ 匿名化処理 - IP/UserAgentハッシュ化

**動作確認済み:**
- バックエンド正常起動 (`npm start`)
- API呼び出し成功 (統計記録・取得)
- フロントエンド統計表示 (記事作成数、API使用数、アクティブユーザー数)

---

**最終更新**: 2025-09-03  
**Phase 1 完了**: 2025-09-03  
**次回作業**: Phase 2 さくらVPSデプロイ準備