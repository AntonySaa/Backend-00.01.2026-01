const Insumo = require("../models/model.insumo");

exports.getAllInsumo = async (req, res) => {
  try {
    const data = await Insumo.find().sort({ createdAt: -1 });

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

exports.createInsumo = async (req,res)=>{
    try {
        const data = req.body;
        const newInsumo = new Insumo(data);
        await newInsumo.save();

        res.status(201).json({
      mensaje: "Insumo creado correctamente",
      data: newInsumo
    });

    } catch (error) {
        res.status(500).json({
      mensaje: "Error al crear insumo",
      error: error.message
    });
    }
};

exports.getInsumoById = async (req, res) => {
  try {
    const { id } = req.params;

    const getData = await Insumo.findById(id);

    if (!getData) {
      return next(appError(400, "Insumo no encontrado"));
    }

    return res.status(200).json({ status: "ok", data: getData });
  } catch (error) {
    res.status(500).json ({
        mensaje: "Error al crear insumo",
        error: error.message
    })
  }
};


exports.updateInsumoById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const insumoActualizado = await Insumo.findByIdAndUpdate(
      id,
      data,
      { new: true } 
    );

    if (!insumoActualizado) {
      return res.status(404).json({
        mensaje: "Insumo no encontrado"
      });
    }

    res.json({
      mensaje: "Insumo actualizado",
      data: insumoActualizado
    });

  } catch (error) {
    res.status(500).json({
        mensaje: "Error al crear insumo",
        error: error.message
    })
  }
};

exports.deleteInsumo = async (req,res) => {
    try {
        const { id } = req.params;
        const data = await Insumo.findByIdAndDelete(id);

        res.status(201).json({mensaje: "ok"})
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar insumo",
            error: error.message
        })
    }
};