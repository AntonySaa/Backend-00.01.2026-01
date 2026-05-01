const db = require('../models');
const User = db.user;
const ROLES = db.ROLES;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({
            username: req.body.username
        }).exec();

        if (userByUsername) {
            return res.status(400).send({ message: `El username ${req.body.username} ya esta en uso` });
        }

        const userByEmail = await User.findOne({
            email: req.body.email
        }).exec();

        if (userByEmail) {
            return res.status(400).send({ message: `El email ${req.body.email} ya esta en uso` });
        }

        next();
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

const checkRoleExisted = (req,res,next)=>{
    if(req.body.roles){
        for (let index = 0; index < req.body.roles.length; index++) {
            const element = req.body.roles[index];
            if(!ROLES.includes(element)){
                return res.status(401).send({message: `El Rol ${element} no existe`})
            }
        }
    }
    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRoleExisted
};

module.exports = verifySignUp;
