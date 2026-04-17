const Produccion = require("../models/model.produccion");
const MateriaPrima = require("../models/model.materiaPrima");
const Insumo = require("../models/model.insumo");
const Personal = require("../models/model.personal");

exports.getAllProduccion = async (req, res) => {
  try {
    const data = await Produccion.find()
      .populate("materiaPrimaUsada", "nombre cantidadRecibida")
      .populate("insumosUsados", "nombre cantidadRecibida")
      .populate("personalAsignado", "nombre apellido horasDisponibles")
      .sort({ createdAt: -1 });

    return res.status(201).json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ status: "Error"});
  }
};

exports.createProduccion = async (req, res) => {
  try {
    const { materiaPrimaUsada, insumosUsados, personalAsignado } = req.body;

    const count = await Produccion.countDocuments();

    req.body.materiaPrimaUsada = materiaPrimaUsada;
    req.body.insumosUsados = insumosUsados;
    req.body.personalAsignado = personalAsignado;

    req.body.codigoOrden = `ORD-${String(count + 1).padStart(4, "0")}`;

    const data = new Produccion(req.body);
    await data.save();

    return res.status(201).json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ status: "Error"});
  }
};

exports.getProduccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const getData = await Produccion.findById(id)
      .populate("materiaPrimaUsada")
      .populate("insumosUsados")
      .populate("personalAsignado");

    if (!getData) {
      return next(
        appError(400, "Produccion no encontrada"),
      );
    }

    return res.status(201).json({ status: "ok", data: getData });
  } catch (error) {
    return res.status(500).json({ status: "Error"});
  }
};

exports.UpdateProduccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { cantidad } = req.body;
    const getData = await Produccion.findById(id)
      .populate("materiaPrimaUsada")
      .populate("insumosUsados")
      .populate("personalAsignado");

    if (!getData) {
      return next(
        appError(400, "PRODUCCION_NOT_FOUND", "Produccion no encontrada"),
      );
    }

    getData.cantidad = cantidad;

    await getData.save();

    return res.status(201).json({ status: "ok", data: getData });
  } catch (error) {
    return res.status(500).json({ status: "Error"});
  }
};

exports.deleteProduccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const getData = await Produccion.findByIdAndDelete(id);

    return res.status(201).json({ status: "ok", msg: "Eliminado Correctamente !" });
  } catch (error) {
    return res.status(500).json({ status: "Error"});
  }
};

