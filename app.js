const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
