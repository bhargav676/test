// src/config/multerconfig.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            console.log('[Multer] File accepted:', file.mimetype, file.originalname);
            return cb(null, true);
        }
        console.error('[Multer] File rejected:', file.mimetype, file.originalname);
        cb(new Error('File type not supported. Only JPEG, JPG, or PNG allowed.'));
    },
});

module.exports = upload;