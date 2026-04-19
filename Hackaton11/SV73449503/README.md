# Reto 1 - Base de Datos No Relacional con Mongoose

Proyecto de ejemplo para la empresa de producción de armarios. Implementa compras de materia prima e insumos, gestión de personal y producción usando MongoDB con Mongoose.

## Requisitos
- Node.js 18+
- MongoDB en ejecución (local o remoto)

## Configuración
1. Copiar `.env.example` a `.env` y ajustar `MONGODB_URI` si es necesario. El nombre de la base es el código del alumno: `SV73449503`.
2. Instalar dependencias:

```bash
npm install
```

## Ejecución
- Sembrar datos de ejemplo:

```bash
npm run seed
```

- Ejecutar flujo principal (compras + producción + validación):

```bash
npm run check
```

## Modelo de negocio (resumen)
- Compra de materia prima y compra de insumos mediante documentos `Compra`.
- Gestión de personal con horas disponibles (HH).
- Producción de armarios consumiendo: 1 tablón, 0.25 kg de goma y 8 HH por armario.

## Colecciones
- `materias_primas`
- `insumos`
- `personales`
- `compras`
- `producciones`
