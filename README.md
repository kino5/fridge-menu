# 🥗 今夜なに食べる？ — デプロイ手順

## 📁 フォルダ構成

```
fridge-menu/
├── api/
│   └── analyze.js      ← APIキーを安全に使うサーバー処理
├── public/
│   └── index.html      ← アプリ本体
└── vercel.json         ← Vercel設定
```

---

## 🚀 Vercel にデプロイする手順（コマンドライン不要！）

### Step 1：Vercel アカウントを作る
1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」または「Continue with Email」でアカウント作成

### Step 2：プロジェクトをアップロード
1. https://vercel.com/new にアクセス
2. 画面に **「fridge-menu フォルダ全体**」をドラッグ＆ドロップ
3. 「Deploy」ボタンを押す（設定は変更不要）

### Step 3：APIキーを設定する ⚠️ここが重要！
1. デプロイ完了後、プロジェクトのページで **「Settings」** をクリック
2. 左メニューの **「Environment Variables」** をクリック
3. 以下を入力して「Save」：
   - **Name（名前）**: `ANTHROPIC_API_KEY`
   - **Value（値）**: `sk-ant-xxxxxxxxxx...`（あなたのAPIキー）

### Step 4：再デプロイ
1. 左メニューの「Deployments」をクリック
2. 最新のデプロイの右にある「…」→「Redeploy」を押す

### 完了！🎉
`https://fridge-menu-xxxx.vercel.app` のようなURLでアクセスできます！

---

## 🔑 Anthropic APIキーの取得方法
1. https://console.anthropic.com にアクセス
2. アカウント作成 → ログイン
3. 「API Keys」→「Create Key」でキーを発行

---

## ⚠️ 注意
- APIキーは **絶対に他人に見せないでください**
- Vercelの環境変数に設定すればコードには書かれないので安全です
