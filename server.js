const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 使用 Middleware
app.use(express.json());
app.use(cors());

// KeyAuth 環境變數
const KEYAUTH_APP_ID = process.env.KEYAUTH_APP_ID;
const KEYAUTH_SECRET = process.env.KEYAUTH_SECRET;

// 登入 API
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
            aid: KEYAUTH_APP_ID,
            secret: KEYAUTH_SECRET
        });

        if (response.data.success) {
            res.json({ success: true, message: "登入成功", token: response.data.token });
        } else {
            res.status(401).json({ success: false, message: "登入失敗：" + response.data.message });
        }
    } catch (error) {
        console.error("登入錯誤", error.message);
        res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`🚀 伺服器運行中：http://localhost:${PORT}`);
});
 
