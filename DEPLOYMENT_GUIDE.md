# Shinchitose 專案管理系統 - 完整部署指南

本指南將引導你完成從 Google Sheets 設定到前端部署的完整流程。

## 📋 前置準備

- Google 帳號
- Node.js 安裝 (v18+)
- 文字編輯器或 IDE

---

## 第一部分：後端設定（Google Sheets + Apps Script）

### 步驟 1: 建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 點選「空白」建立新的試算表
3. 將試算表重新命名為：`Shinchitose Project Management`
4. 複製試算表的 ID
   - 在瀏覽器網址列中，ID 位於 `/d/` 和 `/edit` 之間
   - 範例：`https://docs.google.com/spreadsheets/d/**1AbCdEfGhIjKlMnOpQrStUvWxYz**/ edit`

### 步驟 2: 建立工作表結構

在試算表中建立 6 個工作表（Sheet），點選左下角的 `+` 按鈕新增工作表：

1. **Projects**
2. **Tasks**
3. **Meetings**
4. **Documents**
5. **SocialContents**
6. **Users**

> 💡 **提示**：可以直接刪除預設的 `工作表1`

### 步驟 3: 設定欄位標題

在每個工作表的**第一行**輸入對應的欄位名稱。詳細的欄位定義請參考 [backend/SHEETS_SETUP.md](backend/SHEETS_SETUP.md)。

**快速範例 - Projects 工作表第一行：**
```
id | name | description | status | priority | startDate | deadline | ownerId | progress | members
```

### 步驟 4: 匯入範例資料（選用）

如果想要測試資料，可以在對應的工作表中新增第二行，參考 [SHEETS_SETUP.md](backend/SHEETS_SETUP.md) 的範例資料。

### 步驟 5: 部署 Apps Script

1. 在 Google Sheets 中，點選頂部選單：**擴充功能** → **Apps Script**
2. 刪除預設的 `function myFunction() {}` 程式碼
3. 複製 [`backend/Code.gs`](backend/Code.gs) 的**完整內容**並貼上
4. **重要**：修改第 9 行的 `SPREADSHEET_ID`
   ```javascript
   const SPREADSHEET_ID = '你的試算表ID'; // ← 貼上步驟 1 複製的 ID
   ```
5. （選用）如果要啟用 API金鑰保護，修改第 10 行：
   ```javascript
   const API_KEY = 'your_secret_api_key_here';
   ```

### 步驟 6: 部署為 Web App

1. 在 Apps Script 編輯器中，點選右上角的 **部署** → **新增部署作業**
2. 在「選取類型」旁點選齒輪圖示 ⚙️
3. 選擇 **網頁應用程式**
4. 填寫設定：
   - **說明**：`Shinchitose API v1`（或任意名稱）
   - **執行身分**：**我**
   - **具有存取權的使用者**：**任何人**（建議設定 API Key）
5. 點選 **部署**
6. **複製網頁應用程式網址**
   - 格式：`https://script.google.com/macros/s/AKfycbxxx.../exec`
   - ⚠️ **請妥善保存此網址，稍後會用到**

### 步驟 7: 測試 API（選用但建議）

在瀏覽器中開啟以下網址測試 API 是否正常：
```
你的Web App網址?action=getAll&type=projects
```

應該會看到 JSON 格式的回應：
```json
{"success":true,"data":[]}
```

---

## 第二部分：前端設定

### 步驟 8: 安裝相依套件

在專案根目錄執行：
```bash
npm install
```

### 步驟 9: 建立環境變數檔案

1. 複製範例檔案：
   ```bash
   cp .env.local.example .env.local
   ```

2. 編輯 `.env.local`，填入你的 Apps Script 網址：
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/你的SCRIPT_ID/exec
   VITE_API_KEY=your_optional_api_key
   VITE_USE_API_KEY=false
   ```

   > 💡 如果在步驟 5 設定了 API_KEY，將 `VITE_USE_API_KEY` 改為 `true`

### 步驟 10: 啟動開發伺服器

```bash
npm run dev
```

應該會看到：
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### 步驟 11: 開啟瀏覽器測試

1. 開啟 http://localhost:3000
2. 應該會看到載入畫面，然後顯示主畫面
3. 嘗試建立新專案測試功能

---

## 第三部分：驗證與測試

### ✅ 功能檢查清單

- [ ] 資料成功從 Google Sheets 載入
- [ ] 建立新專案後出現在 Google Sheets 中
- [ ] 更新專案資訊能同步到 Google Sheets
- [ ] 刪除專案後從 Google Sheets 中移除
- [ ] 任務、會議、文件、社群內容的 CRUD 操作正常

### 🔍 除錯技巧

**問題：前端顯示「載入失敗」**
- 檢查 `.env.local` 中的 `VITE_APPS_SCRIPT_URL` 是否正確
- 在瀏覽器開發者工具的 Console 查看錯誤訊息
- 確認 Apps Script 部署時選擇了「任何人」存取權限

**問題：API 回應 "Unauthorized"**
- 檢查 API_KEY 設定是否一致（Apps Script 和 `.env.local`）
- 確認 `VITE_USE_API_KEY` 設定正確

**問題：資料沒有儲存到 Google Sheets**
- 確認 Apps Script 中的 `SPREADSHEET_ID` 正確
- 檢查工作表名稱是否完全一致（區分大小寫）
- 確認欄位名稱與 TypeScript interface 一致

**問題：CORS 錯誤**
- Google Apps Script Web App 應該不會有 CORS 問題
- 如果遇到，請確認部署設定中「執行身分」選擇的是「我」

---

## 第四部分：生產環境部署（Vercel）

### 步驟 12: 安裝 Vercel CLI（選用）

```bash
npm install -g vercel
```

### 步驟 13: 部署到 Vercel

1. 在專案根目錄執行：
   ```bash
   vercel
   ```

2. 按照提示操作：
   - Link to existing project? **N**
   - Project name? **shinchitose-project-management**
   - Which directory? **.** (按 Enter)

3. 設定環境變數：
   ```bash
   vercel env add VITE_APPS_SCRIPT_URL production
   ```
   輸入你的 Apps Script URL

4.同樣設定其他環境變數（如需要）：
   ```bash
   vercel env add VITE_API_KEY production
   vercel env add VITE_USE_API_KEY production
   ```

5. 部署到生產環境：
   ```bash
   vercel --prod
   ```

### Updating Deployment

If you have already deployed this project to GitHub and Vercel, follow these steps to update your deployment with the Google Sheets integration.

### 1. Update GitHub Repository

Since you've made changes to the backend and frontend code, you need to push these changes to your GitHub repository.

```bash
# Initialize git if not already (skip if .git folder exists)
git init

# Add all changes
git add .

# Commit changes
git commit -m "feat: Add Google Sheets backend integration"

# If you need to link to your existing repo (replace URL with your repo URL)
# git remote add origin https://github.com/your-username/your-repo-name.git

# Push changes (use --force if you re-initialized git and want to overwrite)
git push [origin] [main]
```

### 2. Update Vercel Configuration

Your Vercel deployment will fail or not work correctly until you add the new environment variables.

1.  Go to your **Vercel Dashboard**
2.  Select your project
3.  Go to **Settings** > **Environment Variables**
4.  Add the following variable:
    -   **Key**: `VITE_APPS_SCRIPT_URL`
    -   **Value**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec` (Copy from your `.env.local` file)
5.  (Optional) If you enabled API Key security:
    -   **Key**: `VITE_API_KEY`
    -   **Value**: `Your chosen API Key`
    -   **Key**: `VITE_USE_API_KEY`
    -   **Value**: `true`

### 3. Redeploy on Vercel

After adding the environment variables:

1.  Go to the **Deployments** tab in Vercel
2.  If the automatic deployment from GitHub failed (due to missing env vars), click **Redeploy** on the latest commit
3.  Ensure the "Redeploy with existing build cache" option is **unchecked** to ensure a fresh build

### 14: 在 Vercel Dashboard 設定環境變數

1. 前往 [vercel.com](https://vercel.com/dashboard)
2. 選擇你的專案
3. 前往 **Settings** → **Environment Variables**
4. 新增環境變數：
   - `VITE_APPS_SCRIPT_URL` → 你的 Apps Script URL
   - `VITE_API_KEY` → （如果有設定）
   - `VITE_USE_API_KEY` → `false` 或 `true`

---

## 📚 進階設定

### 啟用 API 金鑰保護

1. 編輯 `backend/Code.gs`：
   ```javascript
   const API_KEY = 'your_super_secret_key_12345';
   ```

2. 在 `doGet` 和 `doPost` 函數中，取消以下註解：
   ```javascript
   if (API_KEY && apiKey !== API_KEY) {
     return createResponse({ error: 'Unauthorized' }, 401);
   }
   ```

3. 重新部署 Apps Script（建立新版本）

4. 更新 `.env.local`：
   ```
   VITE_API_KEY=your_super_secret_key_12345
   VITE_USE_API_KEY=true
   ```

### 資料備份

建議定期備份 Google Sheets：
1. 在 Google Sheets 中，點選 **檔案** → **建立副本**
2. 或使用 Google Takeout 匯出資料

---

## 🆘 常見問題（FAQ）

**Q: 可以有多個人同時使用嗎？**  
A: 可以，但 Google Sheets 不是為高併發設計的。建議用於中小型團隊（< 20 人）。

**Q: 每天可以呼叫多少次 API？**  
A: Google Apps Script 免費版每天有 20,000 次呼叫限制，對一般使用綽綽有餘。

**Q: 資料會遺失嗎？**  
A: Google Sheets 會自動儲存，除非你手動刪除，否則資料不會遺失。建議定期備份。

**Q: 可以使用其他資料庫嗎？**  
A: 可以！只要修改 `dataService.ts`，改成連接你想要的後端 API 即可。

---

## ✨ 下一步

- 閱讀 [backend/SHEETS_SETUP.md](backend/SHEETS_SETUP.md) 了解詳細的資料結構
- 自訂設計和樣式
- 新增更多功能（通知、檔案上傳等）
- 整合其他 Google Workspace 工具（Calendar、Drive）

---

## 📞 需要協助？

如果遇到問題，請檢查：
1. 瀏覽器開發者工具的 Console
2. Google Apps Script 的執行記錄（Apps Script 編輯器 → 執行作業）
3. Network 面板查看 API 請求和回應
