# Google Sheets 設定指南

本文件說明如何設定 Google Sheets 作為 Shinchitose 專案管理系統的後端資料庫。

## 步驟 1: 建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表，命名為 `Shinchitose Project Management`
3. 記下試算表的 ID（在網址列中）
   - 網址格式：`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## 步驟 2: 建立工作表

建立以下 6 個工作表（Sheet），每個工作表的第一行為欄位名稱：

### 2.1 Projects 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 專案唯一識別碼 | p1 |
| name | 專案名稱 | Shinchitose Project Alpha |
| description | 專案描述 | Main flagship project for 2024. |
| status | 專案狀態 | 進行中 |
| priority | 優先順序 | 高 |
| startDate | 開始日期 | 2024-01-01 |
| deadline | 截止日期 | 2024-12-31 |
| ownerId | 擁有者 ID | admin@gmail.com |
| progress | 進度（0-100） | 35 |
| members | 成員列表（JSON字串） | [{"gmail":"admin@gmail.com","role":"Owner","status":"Active"}] |

### 2.2 Tasks 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 任務唯一識別碼 | t1 |
| projectId | 所屬專案 ID | p1 |
| name | 任務名稱 | UI Mockup Design |
| description | 任務描述 | Design the main UI mockup |
| status | 任務狀態 | Doing |
| priority | 優先順序 | 高 |
| dueDate | 截止日期 | 2024-05-20 |
| assignee | 負責人 | user1@gmail.com |
| meetingId | 相關會議 ID | m1 |
| relatedDocId | 相關文件 ID | d1 |

### 2.3 Meetings 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 會議唯一識別碼 | m1 |
| projectId | 所屬專案 ID | p1 |
| title | 會議標題 | Initial planning session |
| time | 會議時間 | 2024-05-18 14:00 |
| duration | 會議時長 | 60 min |
| link | 會議連結 | https://meet.google.com/xyz-abc |
| attendees | 參與者（JSON字串） | ["admin@gmail.com"] |
| type | 會議類型 | 專案同步 |
| remarks | 備註 | Initial planning session notes. |
| decisionContent | 決策內容 | Approved tech stack. |
| decisionReason | 決策原因 | Aligned with modern web standards. |
| decisionMaker | 決策者 | admin@gmail.com |
| decisionTime | 決策時間 | 2024-05-18 15:00 |
| isCompleted | 是否完成 | true |

### 2.4 Documents 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 文件唯一識別碼 | d1 |
| name | 文件名稱 | Product Spec |
| projectId | 所屬專案 ID | p1 |
| documentType | 文件類型 | Specification |
| type | 類型 | 規格 |
| fileUrl | 檔案連結 | https://drive.google.com/123 |
| fileSize | 檔案大小 | 2.5MB |
| uploadedBy | 上傳者 | admin@gmail.com |
| version | 版本 | 1.0 |
| relatedTaskIds | 相關任務 ID | t1,t2 |

### 2.5 SocialContents 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 內容唯一識別碼 | s1 |
| projectId | 所屬專案 ID | p1 |
| title | 標題 | Launch Announcement |
| content | 內容 | Exciting news coming soon! |
| platform | 平台 | Facebook |
| status | 狀態 | 草稿 |
| publishTime | 發布時間 | 2024-06-01 |
| hashtags | 標籤 | #launch #sc |
| theme | 主題 | Promotion |
| materialLink | 素材連結 | https://figma.com/123 |
| budget | 預算 | 500 |
| date | 日期 | 2024-06-01 |
| postLink | 貼文連結 | https://facebook.com/post/123 |
| type | 類型 | Announcement |
| collaborator | 協作者 | user1@gmail.com |

### 2.6 Users 工作表

| 欄位名稱 | 說明 | 範例值 |
|---------|------|--------|
| id | 使用者唯一識別碼 | u1 |
| email | 電子郵件 | admin@gmail.com |
| name | 姓名 | Admin User |
| avatar | 頭像網址 | https://example.com/avatar.jpg |
| loginMethod | 登入方式 | email |

## 步驟 3: 匯入範例資料（選用）

您可以直接複製貼上以下範例資料到對應的工作表中：

### Projects 工作表
```
p1	Shinchitose Project Alpha	Main flagship project for 2024.	進行中	高	2024-01-01	2024-12-31	admin@gmail.com	35	[{"gmail":"admin@gmail.com","role":"Owner","status":"Active"},{"gmail":"user1@gmail.com","role":"Editor","status":"Active"}]
```

### Tasks 工作表
```
t1	p1	UI Mockup Design		Doing	高	2024-05-20	user1@gmail.com			
t2	p1	API Integration		Todo	中	2024-05-25				
t3	p1	Database Setup		Done	高	2024-05-15				
```

### Meetings 工作表
```
m1	p1	Initial planning session	2024-05-18 14:00	60 min	https://meet.google.com/xyz-abc	["admin@gmail.com"]	專案同步	Initial planning session notes.	Approved tech stack.	Aligned with modern web standards.	admin@gmail.com	2024-05-18 15:00	true
```

### Documents 工作表
```
d1	Product Spec	p1	Specification		https://drive.google.com/123				
```

### SocialContents 工作表
```
s1	p1	Launch Announcement	Exciting news coming soon!	Facebook	草稿	2024-06-01	#launch #sc	Promotion	https://figma.com/123	500			
```

## 步驟 4: 設定 Apps Script

1. 在 Google Sheets 中，點選 **擴充功能** > **Apps Script**
2. 刪除預設的 `Code.gs` 內容
3. 複製 `backend/Code.gs` 的完整內容並貼上
4. 修改第 9 行的 `SPREADSHEET_ID`，填入您的試算表 ID
5. （選用）修改第 10 行的 `API_KEY`，設定自訂的 API 金鑰

## 步驟 5: 部署 Web App

1. 在 Apps Script 編輯器中，點選右上角的 **部署** > **新增部署作業**
2. 選擇類型：**網頁應用程式**
3. 設定說明：`Shinchitose API v1`
4. 執行身分：**我**
5. 具有存取權的使用者：
   - **任何人** (公開，建議使用 API Key 保護)
   - **任何擁有 Google 帳戶的使用者** (需要登入)
6. 點選 **部署**
7. 複製 **網頁應用程式網址**（格式：`https://script.google.com/macros/s/.../exec`）

## 步驟 6: 測試 API

使用瀏覽器或 Postman 測試 API：

### 測試 GET 請求（取得所有專案）
```
GET https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getAll&type=projects
```

### 測試 POST 請求（建立新專案）
```
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=create&type=projects
Content-Type: application/json

{
  "id": "p2",
  "name": "New Project",
  "description": "Test project",
  "status": "規劃中",
  "priority": "中",
  "startDate": "2024-06-01",
  "deadline": "2024-12-01",
  "ownerId": "admin@gmail.com",
  "progress": 0,
  "members": []
}
```

## 常見問題

### Q: 為什麼 API 回應很慢？
A: Google Apps Script 的執行速度受到配額限制，通常第一次執行會較慢（冷啟動）。後續請求會快一些。

### Q: 如何保護 API 不被濫用？
A: 可以啟用 `API_KEY` 驗證（取消 Code.gs 中的註解），並在前端請求時帶上 `apiKey` 參數。

### Q: 資料格式錯誤怎麼辦？
A: 確保 Google Sheets 中的欄位名稱與 TypeScript interface 完全一致（區分大小寫）。

### Q: 可以處理多少資料？
A: Google Sheets 單一工作表支援最多 1000 萬個儲存格。對於中小型專案管理系統來說綽綽有餘。

## 下一步

完成 Google Sheets 設定後，請參考 [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) 繼續設定前端應用程式。
