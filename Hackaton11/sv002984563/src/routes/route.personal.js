const router = require("express").Router();

const {
    getAllPersonal,
    createPersonal,
    getPersonalById,
    updatePersonal,
    deletePersonal
} = require(`../controllers/controller.personal`);

router.get(`/`,getAllPersonal);
router.post(`/`,createPersonal);
router.get(`/:id`,getPersonalById);
router.put(`/:id`,updatePersonal);
router.delete(`/:id`,deletePersonal);

module.exports = router;