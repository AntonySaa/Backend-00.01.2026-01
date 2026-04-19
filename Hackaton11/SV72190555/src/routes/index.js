const Router = require("express");
const { readdirSync } = require("fs");

const PATH_ROUTER = `${__dirname}`;
const router = Router();

const cleanFileName = (filename) => filename.split(".").shift();

readdirSync(PATH_ROUTER).filter((filename) => {
  const cleanName = cleanFileName(filename);
  if (cleanName !== "index") {
    const module = require(`./${filename}`);
    router.use(`/${cleanName}`, module);
    console.log(`Ruta cargada: /api/${cleanName}`);
  }
});

module.exports = router;
