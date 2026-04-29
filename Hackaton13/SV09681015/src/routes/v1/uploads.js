const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { asyncHandler } = require('../../middlewares/errorHandler');

const router = Router();

// ── Configuración multer ────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (image/*)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// ── POST /api/v1/uploads/avatar ─────────────────────────────────────────────
router.post(
  '/avatar',
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'Archivo demasiado grande (máx. 2MB)' });
        }
        return res.status(400).json({ error: err.message });
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    res.status(201).json({
      message: 'Avatar subido correctamente',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: `${(req.file.size / 1024).toFixed(1)} KB`,
        mimetype: req.file.mimetype,
        path: `/uploads/${req.file.filename}`,
      },
    });
  })
);

// ── GET /api/v1/uploads/:filename (descarga) ────────────────────────────────
router.get('/:filename', asyncHandler(async (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  res.sendFile(filePath);
}));

module.exports = router;
