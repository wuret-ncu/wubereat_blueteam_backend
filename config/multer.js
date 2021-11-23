const multer = require("multer");
const path = require("path");

//image upload
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
         cb(null, path.join("./files/"));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);    // 獲得檔案的原始名稱（名稱＋檔案格式）
    }
});

// checking file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);    // 若接受該檔案：呼叫時帶入 true
    } else {
        cb(new Error('Not an image! Please upload an image.', 400), false);    // 輸出錯誤訊息
    }
};

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});