const db = require('../models');
const bcript = require('bcrypt');
const User = db.User;

exports.addUser = (req,res)=>{
    const usuarioNuevo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcript.hashSync(req.body.password, 8),
        role: req.body.role || "reader"
    };
    User.create(usuarioNuevo).then(data=>{
        res.status(201).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}

exports.updateUser = (req,res)=>{
    let userID = req.params.id
    const usuarioNuevo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcript.hashSync(req.body.password, 8),
        role: req.body.role || "reader"
    };
    User.update(usuarioNuevo,{
        where: {id: userID}
    }).then(data=>{
        res.status(201).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}

exports.deleteUser = (req,res)=>{
    let userID = req.params.id
    User.destroy({
        where: {id: userID}
    }).then(data=>{
        res.status(201).send(data);
    }).catch(error=>{
        res.status(500).send(error);
    })

}

