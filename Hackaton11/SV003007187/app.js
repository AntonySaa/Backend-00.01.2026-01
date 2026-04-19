require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

//base de datos 
const codigoAlumno = process.env.DB_NAME;
     

//  MongoDB Atlas
 const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-suskias-shard-00-00.x60mrnl.mongodb.net:27017,ac-suskias-shard-00-01.x60mrnl.mongodb.net:27017,ac-suskias-shard-00-02.x60mrnl.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-tu3o76-shard-0&authSource=admin&retryWrites=true&w=majority`;
// Coneccion a MongoDB Atlas
mongoose.connect(url)
  .then(() => console.log(' Conectado a MongoDB Atlas - BD:', codigoAlumno))
  .catch(err => console.log(' Error de conexion:', err));


// Esquema de todos los recursos

const inventarioSchema = new mongoose.Schema({
    // Materia prima 
    tablones: { type: Number, default: 0 },
    pegamento: { type: Number, default: 0 },
    
    // Insumos 
    tornillos: { type: Number, default: 0 },
    barniz: { type: Number, default: 0 },
    
    // Personal 
    horasNormales: { type: Number, default: 0 },
    horasExtras: { type: Number, default: 0 },
    
    // Produccion
    armariosProducidos: { type: Number, default: 0 }
});

const Inventario = mongoose.model('Inventario', inventarioSchema);


// RUTAS


app.get('/', (req, res) => {
    res.send(`
        <h1>Control de Produccion de Armarios</h1>
        <p>Base de datos: ${codigoAlumno} (MongoDB Atlas)</p>
        
        <button onclick="verInventario()">Ver Inventario</button>
        <button onclick="comprarMateriaPrima()">Comprar Materia Prima (3 tablones + 1 pegamento)</button>
        <button onclick="comprarInsumos()">Comprar Insumos (1 tornillo + 0.25 barniz)</button>
        <button onclick="gestionPersonal()">Gestion Personal (+40 normales +8 extras)</button>
        <button onclick="producir()">Producir Armario</button>
        
        <pre id="resultado" style="background:#f0f0f0; padding:10px;">Presiona un boton</pre>
        
        <script>
            async function verInventario() {
                const res = await fetch('/api/inventario');
                const data = await res.json();
                document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
            }
            async function comprarMateriaPrima() {
                const res = await fetch('/api/comprar/materia-prima', {method: 'POST'});
                const data = await res.json();
                document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
            }
            async function comprarInsumos() {
                const res = await fetch('/api/comprar/insumos', {method: 'POST'});
                const data = await res.json();
                document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
            }
            async function gestionPersonal() {
                const res = await fetch('/api/gestion/personal', {method: 'POST'});
                const data = await res.json();
                document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
            }
            async function producir() {
                const res = await fetch('/api/producir', {method: 'POST'});
                const data = await res.json();
                document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
            }
            verInventario();
        </script>
    `);
});

app.get('/api/inventario', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) {
        inv = new Inventario();
        await inv.save();
    }
    res.json(inv);
});

app.post('/api/comprar/materia-prima', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) inv = new Inventario();
    inv.tablones += 3;
    inv.pegamento += 1;
    await inv.save();
    res.json({ mensaje: "Compra Materia Prima: +3 tablones, +1 pegamento", inventario: inv });
});

app.post('/api/comprar/insumos', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) inv = new Inventario();
    inv.tornillos += 1;
    inv.barniz += 0.25;
    await inv.save();
    res.json({ mensaje: "Compra Insumos: +1 tornillo, +0.25 barniz", inventario: inv });
});

app.post('/api/gestion/personal', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) inv = new Inventario();
    inv.horasNormales += 40;
    inv.horasExtras += 8;
    await inv.save();
    res.json({ mensaje: "Gestion Personal: +40 normales, +8 extras", inventario: inv });
});

app.post('/api/producir', async (req, res) => {
    let inv = await Inventario.findOne();
    if (!inv) {
        inv = new Inventario();
        await inv.save();
    }
    
    const totalHoras = inv.horasNormales + inv.horasExtras;
    
    if (inv.tablones >= 1 && inv.barniz >= 0.25 && totalHoras >= 8) {
        inv.tablones -= 1;
        inv.barniz -= 0.25;
        
        if (inv.horasNormales >= 8) {
            inv.horasNormales -= 8;
        } else {
            const falta = 8 - inv.horasNormales;
            inv.horasNormales = 0;
            inv.horasExtras -= falta;
        }
        
        inv.armariosProducidos += 1;
        await inv.save();
        res.json({ mensaje: "Armario producido", inventario: inv });
    } else {
        res.status(400).json({
            error: "Recursos insuficientes",
            necesario: { tablones: 1, barniz: 0.25, horas: 8 },
            disponible: {
                tablones: inv.tablones,
                barniz: inv.barniz,
                horasNormales: inv.horasNormales,
                horasExtras: inv.horasExtras,
                totalHoras: totalHoras
            }
        });
    }
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
    
    console.log('BASE DE DATOS:', codigoAlumno);
    console.log('Servidor: http://localhost:' + PUERTO);
   
});