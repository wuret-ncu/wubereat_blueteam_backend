const multer = require("multer");


//image upload
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
         cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);    // 獲得檔案的原始名稱（名稱＋檔案格式）
    }
});

// checking file type
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 //50 MB
    },
    fileFilter: fileFilter
});