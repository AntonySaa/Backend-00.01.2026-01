# INSTRUCCIONES RÁPIDAS

## 1. Iniciar servidor
```bash
npm start
```

## 2. Abrir navegador
```
http://localhost:3000
```

## 3. Probar funciones

### Chat normal
- Ingresa tu nombre
- Envia mensajes

### Editar mensaje
- **Clic** sobre tu propio mensaje → aparece input → modifica → Guardar

### Eliminar mensaje
- Botón **Eliminar** aparece al pasar mouse sobre tu mensaje
- O doble clic directo

### Borrar historial
- Botón **"Borrar mi Historial"** en la barra lateral
- Elimina todos tus mensajes

### Invocar asistente IA (Gemini)
Escribe `@bot` o `@ai` en tu mensaje:
```
@bot hola
@ai recomiéndame una película
```

## Archivos importantes

- `server.js` - Backend Express + Socket.io + Gemini API
- `public/index.html` - Interfaz
- `public/client.js` - Lógica frontend
- `.env` - Configuración (ya tiene tu API key de Gemini)

## La API key de Gemini ya está configurada en `.env`

El bot responderá automáticamente cuando mentions `@bot` o `@ai`.