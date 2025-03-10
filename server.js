require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // 使用 Railway 自動分配的 PORT

app.use(express.json());
app.use(cors()); // 允許跨來源請求

// 測試 API 是否運行
app.get("/", (req, res) => {
    res.send("🚀 KeyAuth API 運行中！");
});

// KeyAuth 登入 API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "請提供帳號和密碼" });
    }

    try {
        const response = await axios.post("https://keyauth.win/api/1.2/", {
            type: "login",
            username: username,
            pass: password,
            ownerid: process.env.KEYAUTH_OWNER_ID,
            appid: process.env.KEYAUTH_APP_ID,
            secret: process.env.KEYAUTH_SECRET
        });

        if (response.data.success) {
            res.json({ success: true, message: "登入成功", token: response.data.sessionid });
        } else {
            res.status(401).json({ success: false, message: response.data.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "伺服器錯誤", error: error.message });
    }
});

// 監聽 0.0.0.0，確保外部可訪問
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 伺服器運行中：http://localhost:${PORT}`);
});
