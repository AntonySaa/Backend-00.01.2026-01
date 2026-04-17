const MateriaPrima = require("../models/model.materiaPrima");

exports.getAllMateriaPrima = async (req, res) => {
  try {
    const data = await MateriaPrima.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "ok",
      data
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

exports.createMateriaPrima = async (req,res)=>{
    try {
        const data = req.body;
        const newMateriaPrima = new MateriaPrima(data);
        await newMateriaPrima.save();

        res.status(201).json({
      mensaje: "Creado correctamente",
      data: newMateriaPrima
    });

    } catch (error) {
        res.status(500).json({
      mensaje: "Error al crear",
      error: error.message
    });
    }
};
 
exports.getMateriaPrimaById = async (req, res) => {
  try {
    const { id } = req.params;

    const getData = await MateriaPrima.findById(id);

    if (!getData) {
      return next(appError(400, "No encontrado"));
    }

    return res.status(200).json({ status: "ok", data: getData });
  } catch (error) {
    res.status(500).json ({
        mensaje: "Error al crear",
        error: error.message
    })
  }
};

exports.updateMateriaPrimaById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const materiaPrimaActualizada = await MateriaPrima.findByIdAndUpdate(
      id,
      data,
      { new: true } 
    );

    if (!materiaPrimaActualizada) {
      return res.status(404).json({
        mensaje: "No encontrado"
      });
    }

    res.json({
      mensaje: "Actualizado",
      data: materiaPrimaActualizada
    });

  } catch (error) {
    res.status(500).json({
        mensaje: "Error al crear",
        error: error.message
    })
  }
};

exports.deleteMateriaPrima = async (req,res) => {
    try {
        const { id } = req.params;
        const data = await MateriaPrima.findByIdAndDelete(id);

        res.status(201).json({mensaje: "ok"})
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar",
            error: error.message
        })
    }
};