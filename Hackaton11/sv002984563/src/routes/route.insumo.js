const router = require("express").Router();

const {
    getAllInsumo,
    createInsumo,
    getInsumoById,
    updateInsumoById,
    deleteInsumo
} = require (`../controllers/controller.insumo`);

router.get(`/`,getAllInsumo);
router.post(`/`,createInsumo);
router.get(`/:id`,getInsumoById);
router.put(`/:id`,updateInsumoById);
router.delete(`/:id`,deleteInsumo);

module.exports = router;