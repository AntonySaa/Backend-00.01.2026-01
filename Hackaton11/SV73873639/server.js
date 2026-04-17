const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
}
mongoose.connect(uri).then(() => console.log('¡Conexión a MongoDB (SV73873639) exitosa!'));

const app = express();
app.use(express.json());
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// --- ESQUEMAS DE MONGOOSE ---

// 1. Esquema del Inventario (El que ya teníamos)
const inventarioSchema = new mongoose.Schema({
    tablones: { type: Number, default: 0 },
    goma_kg: { type: Number, default: 0 },
    horas_hombre: { type: Number, default: 0 },
    armarios_producidos: { type: Number, default: 0 }
});
const Inventario = mongoose.model('Inventario', inventarioSchema);

// 2. NUEVO: Esquema del Historial de Operaciones
const registroSchema = new mongoose.Schema({
    accion: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});
const Registro = mongoose.model('Registro', registroSchema);

// --- RUTAS DE LA API ---

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/inventario', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) {
        inv = new Inventario();
        await inv.save();
    }
    res.json(inv);
});

// NUEVO: Ruta para leer los últimos 10 registros
app.get('/api/registros', async (req, res) => {
    try {
        const registros = await Registro.find().sort({ fecha: -1 }).limit(10);
        res.json(registros);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/inventario/abastecer', async (req, res) => {
    const { tipo } = req.body;
    let inv = await Inventario.findOne();
    let mensajeLog = "";

    if (!inv) {
        inv = new Inventario();
        await inv.save();
    }
    
    if (tipo === 'materia_prima') { inv.tablones += 3; mensajeLog = "Se compró un Lote de Tablones (+3)"; }
    if (tipo === 'insumo') { inv.goma_kg += 1; mensajeLog = "Se compró un Lote de Goma (+1kg)"; }
    if (tipo === 'personal') { inv.horas_hombre += 40; mensajeLog = "Se registró un Turno de Personal (+40 HH)"; }

    await inv.save();

    // Guardar en el historial
    const nuevoRegistro = new Registro({ accion: mensajeLog });
    await nuevoRegistro.save();

    res.json({ mensaje: "Abastecimiento exitoso", inventario: inv });
});

app.post('/api/inventario/producir', async (req, res) => {
    let inv = await Inventario.findOne();
    
    if (inv.tablones >= 1 && inv.goma_kg >= 0.25 && inv.horas_hombre >= 8) {
        inv.tablones -= 1;
        inv.goma_kg -= 0.25;
        inv.horas_hombre -= 8;
        inv.armarios_producidos += 1;
        
        await inv.save();

        // Guardar éxito en historial
        await new Registro({ accion: "Producción Exitosa: +1 Armario fabricado" }).save();
        
        res.json({ mensaje: "Armario fabricado con éxito", inventario: inv });
    } else {
        // Guardar error en historial
        await new Registro({ accion: "Error: Intento de producción fallido (Falta de recursos)" }).save();
        res.status(400).json({ error: "Recursos insuficientes para producir un armario" });
    }
});


const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`Fábrica operativa en puerto ${PUERTO}`));
