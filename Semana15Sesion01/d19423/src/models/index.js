const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.user = require('./user.model');
db.role = require('./role.model');
db.mongoose = mongoose;
db.ROLES = ['admin', 'moderator', 'user'];

db.init = async () => {
    const count = await db.role.estimatedDocumentCount();

    if (count === 0) {
        for (const element of db.ROLES) {
            try {
                await new db.role({ name: element }).save();
                console.log(`Rol ${element} creado`);
            } catch (error) {
                console.error(`Error al crear el rol ${element}`, error);
            }
        }
    }
}


module.exports = db;
