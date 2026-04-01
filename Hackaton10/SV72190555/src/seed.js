require("dotenv").config();
const sequelize = require("./db");
const { User } = require("./models");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Conexion con la BD exitosa.");
    await sequelize.sync({ alter: true });

    await User.bulkCreate(
      [
        { firstName: "Juan", lastName: "Perez", email: "juan@test.com", passwordHash: "1234" },
        { firstName: "Ana",  lastName: "Garcia", email: "ana@test.com",  passwordHash: "1234" },
      ],
      { ignoreDuplicates: true }
    );

    console.log(`${await User.count()} usuarios en la BD.`);
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();
