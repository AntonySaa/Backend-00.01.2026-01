console.log("Inicio del client")

window.addEventListener('load',init,false);

function init(){
    console.log("Termino de cargar la pagina");
    wsConnect();
}

function wsConnect(){
    console.log("Se va aconectar al ws");
    webSocket = new WebSocket("ws://localhost:8000");
    webSocket.onopen = function(evt){
        onOpen(evt);
        
    }
    webSocket.onclose = function(evt){
        onClose(evt);
        console.log("Conexion abierta")
    }
    webSocket.onerror = function(evt){
        console.error(evt);
    }
    webSocket.onmessage = function(evt){
        onMessage(evt);
    }
}

function onMessage(evt){
    document.getElementById("mensajes").append(evt.data + "\n");
}


function onOpen(evt){
    document.getElementById("enviar").disabled=false;
    console.log("Conexion abierta")
}

function onClose(evt){
    document.getElementById("enviar").disabled=true;
    console.log("Conexion cerrada");
    setTimeout(()=>{
        wsConnect()
    }, 2000);
}

function doSend(msg){
    let objMensaje ={};

    objMensaje.message = msg;
    console.log(objMensaje);
    webSocket.send(JSON.stringify(objMensaje));
}

function enviarTexto(event){
    console.log(event)
    event.preventDefault();
    let campo = event.target.texto;
    doSend(campo.value)
    campo.value = "";

}