const Personal = require(`../models/model.personal`);

exports.getAllPersonal = async (req, res) => {
     try {
      const data = await Personal.find()
      .sort({ createdAt: -1 });

      return res.status(201).json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ status: "Error" })
  }
}

exports.createPersonal = async (req, res) => {
    try {
        const data = new Personal(req.body);
        await data.save();

        res.status(201).json({ status: "ok", data });
    } catch (error) {
        res.status(500).json({ status: "Error al crear personal" });        
    }
}

exports.getPersonalById = async (req, res) => {
    try {
        const { id } = req.params;
        const getData = await Personal.findById(id);

        if(!getData){
            return res.status(400).json({ status: "Personal no encontrado"});
        }

        return res.status(201).json({ status: "ok", data: getData });
    } catch (error) {
        return res.status(500).json({ status: "Error"});
    }
};

exports.updatePersonal = async (req, res) => {
    try {
        
        const { id } = req.params;
        const getData = await Personal.findOneAndUpdate(id);

        if (!getData) {
            return res.status(400).json({ status: "Personal no encontrado"});
        }

        return res.status(200).json({status:"Personal actualizado"});
    } catch (error) {
        return res.status(500).json({status: "Error"});
    }
};

exports.deletePersonal = async (req, res) => {
    try {
        const { id } = req.params;
        const getData = await Personal.findByIdAndDelete(id);

        if(!getData){
            return res.status(400).json({ status: "Personal no encontrado"});
        }
        return res.status(200).json({status: "Personal eliminado" });
    } catch (error) {
        return res.status(500).json ({status: "Error"});
    }
}