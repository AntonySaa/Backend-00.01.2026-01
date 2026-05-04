# Reto 1 - Sistema de Curier Online (Node.js + SQL + Socket.IO)

## 1) Objetivo del reto
Construir un sistema de curier persistente que permita:
- Registrar usuarios (clientes logueados).
- Crear paquetes con codigo de seguimiento.
- Guardar mensajes por paquete.
- Guardar ubicaciones por paquete.
- Marcar recepcion del paquete.
- Emitir actualizaciones en tiempo real a clientes conectados.

## 2) Tecnologias usadas
- Node.js
- Express
- Socket.IO
- SQLite (motor SQL persistente)

## 3) Objetos de Base de Datos implementados
Se implementaron objetos SQL en `src/schema.sql`:
- Tablas: `users`, `packages`, `package_messages`, `package_locations`, `package_status_history`
- Indices: por tracking y relaciones por paquete
- Trigger: `trg_packages_status_history` para auditar cambios de estado
- Vista: `v_package_timeline` para consolidar historial (mensajes, ubicaciones y estados)

## 4) Algoritmo general de negocio
1. El cliente se loguea (`/api/auth/login`) y obtiene `userId`.
2. Se crea un paquete (`/api/packages`) con estado `CREATED`.
3. Clientes se suscriben por Socket.IO al room del paquete (`join_package`).
4. Durante el transporte:
   - Se registran mensajes (`/messages` o `package_send_message`).
   - Se registran ubicaciones (`/location` o `package_update_location`).
   - Al registrar primera ubicacion, el estado cambia a `IN_TRANSIT`.
5. Al recepcionar, se marca `RECEIVED` (`/receive` o `package_mark_received`).
6. El trigger guarda automaticamente el historial de estados.
7. Cualquier cliente suscrito recibe eventos en tiempo real.

## 5) Endpoints REST principales
- `POST /api/auth/login`
- `POST /api/packages`
- `GET /api/packages/:trackingCode`
- `POST /api/packages/:trackingCode/messages`
- `POST /api/packages/:trackingCode/location`
- `POST /api/packages/:trackingCode/receive`

## 6) Eventos Socket.IO
- Cliente -> servidor:
  - `join_package`
  - `package_send_message`
  - `package_update_location`
  - `package_mark_received`
- Servidor -> clientes:
  - `package:joined`
  - `package:created`
  - `package:message`
  - `package:location`
  - `package:received`

## 7) Ejecucion del proyecto
```bash
npm install
npm start
```
Servidor por defecto:
- `http://127.0.0.1:3000`

## 8) Validacion automatica (3 validaciones)
```bash
npm test
```
El script `scripts/validate-e2e.js` realiza exactamente:
1. Validacion REST (login + creacion de paquete)
2. Validacion en tiempo real con Socket.IO (mensaje + ubicacion emitidos)
3. Validacion de persistencia y estado final (`RECEIVED` + timeline)

## 9) Cumplimiento del reto
Este proyecto cumple el reto porque:
- Usa un motor SQL persistente con objetos de BD.
- Resuelve el problema funcional de curier online.
- Implementa API y Socket.IO para clientes logueados.
- Guarda paquetes, mensajes, ubicaciones y recepcion de forma persistente.
