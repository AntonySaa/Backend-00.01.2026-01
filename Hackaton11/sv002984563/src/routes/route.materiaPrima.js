const router = require("express").Router();

const {
    getAllMateriaPrima,
    createMateriaPrima,
    getMateriaPrimaById,
    updateMateriaPrimaById,
    deleteMateriaPrima
} = require(`../controllers/controller.materiaPrima`);

router.get(`/`,getAllMateriaPrima);
router.post(`/`,createMateriaPrima);
router.get(`/:id`,getMateriaPrimaById);
router.put(`/:id`,updateMateriaPrimaById);
router.delete(`/:id`,deleteMateriaPrima);

module.exports = router;