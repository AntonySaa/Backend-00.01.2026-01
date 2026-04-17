const router = require("express").Router();

const {
    getAllProduccion,
    createProduccion,
    getProduccionById,
    UpdateProduccionById,
    deleteProduccionById
} = require(`../controllers/controller.produccion`);

router.get(`/`,getAllProduccion);
router.post(`/`,createProduccion);
router.get(`/:id`,getProduccionById);
router.put(`/:id`,UpdateProduccionById);
router.delete(`/:id`,deleteProduccionById);

module.exports = router;