#通知

現場演示目前被降低到谷歌地圖API的成本。

隨時克隆此專案，並使用您自己的谷歌地圖API金鑰

---

#街景駕駛模擬

使用谷歌街景的基於網路的駕駛模擬，允許您使用鍵盤控制元件探索世界各地的城市和地址。

##功能

- **街景整合**：真正的谷歌街景全景，提供真實的駕駛體驗

- **多種控制方法**：

- WASD鍵（W=Accelerate，S=Brake，A=左，D=右）

-箭頭鍵（上=Accelerate，下=Brake，左=左，右=右）

-觸控裝置的螢幕按鈕

- **地址搜尋**：輸入任何地址，用現代地點預測開車去那裡

- **實時顯示**：速度和方向指示器

- **地圖整合**：帶有衛星/路線圖託格的並排地圖檢視

- **響應式設計**：適用於桌面、平板電腦和移動裝置

##設定說明

1. **獲取谷歌地圖API金鑰**：

-轉到[谷歌雲控制檯]（https://console.cloud.google.com/）

-建立新專案或選擇現有專案

-啟用以下API：

-地圖JavaScript API

-街景靜態API

-地理編碼API

-地方API

-建立憑證（API金鑰）

-為了安全，將API金鑰限制在您的域

2. **配置API金鑰**：

-開啟`index.html`

-將“YOUR_API_KEY”替換為實際的谷歌地圖API金鑰：

```html

<script async defer src="https://maps.googleapis.com/maps/api/js? key=YOUR_API_KEY&v=weekly&callback=initMap"></script>

```

-注意：我們故意省略“libraries=places”，因為現代Places庫在需要時會自動與核心載入器一起提供。“v=weekly”確保您獲得最新的不間斷續續更新。

3. **執行應用程式**：

-只需在網頁瀏覽器中開啟“index.html”

-或使用本地Web伺服器提供服務：

```bash

#使用Python 3

Python-m http.server 8000

#使用 Node.js（如果您已安裝 http 伺服器）

Npx http-server

#使用PHP

Php -S localhost:8000

```

##用法

###鍵盤控制

- **W**或**↑**：Accelerate

- **S**或**↓**：剎車

- **A**或**←**：左轉

- **D**或**→**：右轉

###滑鼠/觸控控制

-使用螢幕上的按鈕進行加速、剎車、左和右

-在搜尋欄位中輸入地址，然後按回車鍵

-在地圖和衛星檢視之間切換

###導航

1. 鍵入地址並選擇一個建議，或按回車鍵進行地理編碼

2. 使用鍵盤鍵或螢幕上的按鈕來控制移動

3. 觀看右上角的速度和方向指示器

4. 右側的地圖顯示了您當前的位置和周圍環境

##檔案結構

```

街景駕駛模擬/

├── index.html # 主 HTML 檔案

├── styles.css # CSS 造型
