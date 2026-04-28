const { Message } = require('../models');

exports.createMessage = async (req, res) => {
    try {
        const { conversation_id, role, content } = req.body;

        if (!conversation_id || !role || !content) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: conversation_id, role, content'
            });
        }

        const message = await Message.create({
            conversation_id: conversation_id,
            role,
            content
        });

        return res.status(201).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creando mensaje'
        });
    }
};

exports.getMessagesByConversation = async (req, res) => {
    try {
        const { conversation_id } = req.params;

        const messages = await Message.findAll({
            where: { conversation_id: conversation_id },
            order: [['created_at', 'ASC']]
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error obteniendo mensajes'
        });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: 'El contenido es requerido'
            });
        }

        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({
                message: 'Mensaje no encontrado'
            });
        }

        // Incrementar la versión
        message.version = (message.version || 1) + 1;
        message.content = content;
        await message.save();

        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error actualizando mensaje'
        });
    }
};
