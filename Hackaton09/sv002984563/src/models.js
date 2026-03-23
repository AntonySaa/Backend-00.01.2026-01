const{DataTypes} =  require(`sequelize`);
const sequelize = require(`./db`);

const User = sequelize.define("User", {

    firstName: { 
        type: DataTypes.STRING,
        allowNull: false 
    },

    lastName: { 
        type: DataTypes.STRING,
        allowNull: false
    },

    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true
    },
    
    passwordHash: {
         type: DataTypes.STRING, 
         allowNull: false
    },
    
    role: {type: DataTypes.ENUM(`admin`, `instructor`, `student`)}
}, {tableName: `users`});

const Course = sequelize.define("Course", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    slug:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    description:{
        type:DataTypes.TEXT,
        allowNull: false
    },

    published:{
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    },
}, {tableName: "Course", paranoid:true});

User.hasMany(Course);
Course.belongsTo(User);

module.exports = { sequelize, User};

