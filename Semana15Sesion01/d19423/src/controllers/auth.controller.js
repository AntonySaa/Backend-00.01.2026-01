const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = db.user;
const Role = db.role;

exports.signup = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    try {
        await user.save();

        if (req.body.roles) {
            const roles = await Role.find({
                name: {
                    $in: req.body.roles
                }
            }).exec();

            user.roles = roles.map((role) => role._id);
        }
        else {
            const role = await Role.findOne({
                name: 'user'
            }).exec();

            user.roles = [role._id];
        }

        await user.save();
        return res.status(201).send({ message: `Usuario creado correctamente` });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

exports.signuot = (req, res) => {
    try {
        req.session = null;
        res.status(200).send({
            message: `Sesion terminada`
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.signin = async (req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username})
                        .populate("roles","-__v").exec();
        if(!user) return res.status(404).send({ message: `Usuario no encontrado` });
        let passwordValid = bcrypt.compareSync(req.body.password,user.password);
        if(!passwordValid) return res.status(401).send({ message: `password invalido` });

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400
            }
        );
        req.session.token = token;
        let authorities = [];
        user.roles.forEach(element=>authorities.push(element.name));
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities
        });


    } catch (error) {
         res.status(500).send({ message: error });
    }
    
}