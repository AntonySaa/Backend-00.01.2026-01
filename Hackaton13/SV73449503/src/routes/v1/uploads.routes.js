const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const requireApiKey = require('../../middlewares/requireApiKey');

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      const error = new Error('Only image/* files are allowed');
      error.status = 400;
      return cb(error);
    }
    return cb(null, true);
  }
});

router.post('/avatar', requireApiKey, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'avatar file is required' });
  }

  return res.status(201).json({
    uploaded: true,
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    }
  });
});

module.exports = router;
