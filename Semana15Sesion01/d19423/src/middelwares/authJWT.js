const db = require('../models');
const jwt = require('jsonwebtoken');

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
    let token = res.session?.token;
    if (!token) return res.status(401).send({ message: `No estas enviando el token` });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: `Token Invalido` });
        req.userId = decoded.id;
        next();
    })
}

const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (!user) return res.status(404).send({ message: `Usuario no encontrado` });
        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        const hasModerator = roles.some(r => r.name === 'moderator');
        if (hasModerator) return next();
        return res.status(403).send({ message: `Se requiere rol de moderador` });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        if (!user) return res.status(404).send({ message: `Usuario no encontrado` });
        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        const hasAdmin = roles.some(r => r.name === 'admin');
        if (hasAdmin) return next();
        return res.status(403).send({ message: `Se requiere rol de admin` });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const authJWT = {
    verifyToken,
    isModerator,
    isAdmin
}

module.exports=authJWT;