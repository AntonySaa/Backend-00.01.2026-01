console.log("js conectado");

const chatHeader = document.getElementById(`chatHeader`);
const messages = document.getElementById(`messages`);
const messageInput = document.getElementById(`messageInput`);
const sendBtn = document.getElementById(`sendBtn`);

const loginBox = document.getElementById("login");
const chatBox = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const enterBtn = document.getElementById("enterBtn");

let webSocket;
let currentUser = "";
let chat = [];

function setUser() {
    const username = usernameInput.value.trim();
    
    if (username === "") return;
    
    currentUser = username;
    
    renderHeader();
    
    loginBox.style.display = "none";
    chatBox.style.display = "block";
}

enterBtn.addEventListener("click", setUser);

function renderHeader() {
    chatHeader.innerHTML = `<strong>${currentUser}</strong>`;
};

function renderMessages() {
    messages.innerHTML = "";

    chat.forEach(msg =>{
        const div = document.createElement("div");

        div.className = msg.user === currentUser 
        ? "message send" : "message received";

        div.innerHTML = `
        <strong>${msg.user}:</strong>${msg.text}`;

        messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
};


function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "") return;

    const message = {
        user: currentUser,
        text: text,
        date: new Date()
    };

    webSocket.send(JSON.stringify(message));

    messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        sendMessage();
    }
});

window.addEventListener("DOMContentLoaded", init);

function init(){
    console.log(`Termino de cargar la pagina`);
    wsConnect();
    renderHeader();
}

function wsConnect(){
    console.log(`Se va a conectar a ws`);

    webSocket = new WebSocket("ws://localhost:8000");

    webSocket.onopen = function(){
        console.log(`Conexion abierta`);
        sendBtn.disabled = false;
    };

    webSocket.onclose = function(){
        console.log(`Conexion cerrada`);
        sendBtn.disabled = true;

        setTimeout(()=> {
            wsConnect();
        },2000);
    };
    webSocket.onerror = function(err){
        console.error("Error ws:", err);
    };

    webSocket.onmessage = function(evt){
        const data = JSON.parse(evt.data);

        chat.push(data);

        renderMessages();
    };
}



