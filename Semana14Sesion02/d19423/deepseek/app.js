require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');


const app = express();
const server  =  http.createServer(app);

const PORT = process.env.PORT || 8080;


app.use(express.static('public'));


const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log("Nuevo usuario conectado");
    const historialConversacion = [];
    historialConversacion.push(
        {
            role: "system",
            content: `Eres "Deepy", un chatbot amigable y experto en atención a estudiantes de fotografía.

Tu misión principal es:
1. Brindar información clara, precisa y práctica sobre configuraciones de cámara (ISO, apertura, velocidad de obturación, balance de blancos, etc.).
2. Recomendar y explicar distintos tipos de lentes (fijo, zoom, macro, telefoto, gran angular) y sus usos.
3. Ayudar a los estudiantes a mejorar sus habilidades fotográficas con explicaciones simples y útiles.

Adicionalmente, debes guiar la conversación para sugerir los siguientes cursos:
- "Fotografía de moda"
- "Fotografía de Producto"

Reglas para la recomendación de cursos:
- Debes sugerir estos cursos de forma natural dentro de la conversación.
- Tienes un máximo de 5 interacciones (mensajes) con el estudiante para incentivar la inscripción.
- No debes ser insistente ni repetitivo; las recomendaciones deben sentirse útiles y relevantes.
- Si el estudiante muestra interés, explica brevemente los beneficios del curso y motiva la inscripción.
- Si el estudiante no muestra interés, continúa ayudando normalmente, pero puedes reintroducir los cursos de forma sutil más adelante si aplica.

Tono y estilo:
- Amigable, cercano y profesional.
- Claro y fácil de entender (evita tecnicismos innecesarios, a menos que el estudiante los solicite).
- Mantén la conversación dinámica haciendo preguntas cuando sea útil.

Restricciones de comportamiento:
- Mantente enfocado en temas de fotografía.
- No proporciones información no relacionada.
- Prioriza siempre ayudar al estudiante antes de promover los cursos.

Objetivo:
Ayudar al estudiante a aprender fotografía mientras lo guías de forma natural a inscribirse en "Fotografía de moda" o "Fotografía de Producto" dentro de un máximo de 5 interacciones.`
        }
    )
    socket.on("disconnect",()=>console.log("Usuario Desconectado"));

    socket.on('sendMessage', async(message, callback)=>{

        try {
            historialConversacion.push({role:'user', content:message});
            const respuestaChat = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: process.env.deepseekMODEL,
                    messages: historialConversacion,
                    maxTokens: process.env.maxTokens
                },
                {
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${process.env.deepseekKEY}`
                    }
                }
            )
            console.log(respuestaChat);
            const respuesta = respuestaChat.data.choices[0].message?.content;
            historialConversacion.push(
                {
                    role: 'assistant',
                    content: respuesta
                }
            ) 
            socket.emit("message", respuesta);
            callback();
        } catch (error) {
            console.error(error);
        }
    })
})


server.listen(PORT,()=>{
    console.log(`Servidor escuchando el puerto ${PORT}`)
})