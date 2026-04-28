const { Conversation } = require('../models');

exports.createConversation = async (req, res) => {
    try {
        const { title } = req.body;

        const conversation = await Conversation.create({
            title
        });

        return res.status(201).json(conversation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creando conversación'
        });
    }
};

exports.editConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const conversation = await Conversation.findByPk(id);

        if (!conversation) {
            return res.status(404).json({
                message: 'Conversación no encontrada'
            });
        }

        conversation.title = title;
        await conversation.save();

        return res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error cambiando nombre de conversación'
        });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.findAll({
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error obteniendo conversaciones'
        });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findByPk(id);

        if (!conversation) {
            return res.status(404).json({
                message: 'Conversación no encontrada'
            });
        }

        await conversation.destroy();

        return res.status(200).json({
            message: 'Conversación eliminada'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error eliminando conversación'
        });
    }
}