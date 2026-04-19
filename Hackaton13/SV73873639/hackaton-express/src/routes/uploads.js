const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuración de Multer (Almacenamiento en memoria para la Hackatón)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
    fileFilter: (req, file, cb) => {
        // Validar que sea imagen
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido. Solo se permiten imágenes.'));
        }
    }
});

// POST /api/v1/uploads/avatar
router.post('/avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Debes enviar una imagen en el campo "avatar"' });
    }
    
    res.status(200).json({
        message: 'Avatar subido con éxito',
        filename: req.file.originalname,
        size: req.file.size
    });
});

module.exports = router;