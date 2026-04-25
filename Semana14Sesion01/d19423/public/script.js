console.log("Inicio del client")

window.addEventListener('load', init, false);

function init() {
    console.log("Termino de cargar la pagina");
    wsConnect();
}

function wsConnect() {
    console.log("Se va aconectar al ws");
    webSocket = new WebSocket("ws://localhost:8000");
    webSocket.onopen = function (evt) {
        onOpen(evt);

    }
    webSocket.onclose = function (evt) {
        onClose(evt);
        console.log("Conexion abierta")
    }
    webSocket.onerror = function (evt) {
        console.error(evt);
    }
    webSocket.onmessage = function (evt) {
        onMessage(evt);
    }
}

function onMessage(evt) {
    let objMensaje = JSON.parse(evt.data);
    const container = document.getElementById("mensajes");
    
    if (objMensaje.message === "clima") {
        container.appendChild(renderWeatherDashboard(objMensaje.answer));
    } else {
        const entry = document.createElement("div");
        entry.className = "message-entry alert alert-info";
        entry.textContent = objMensaje.message;
        container.appendChild(entry);
    }
    
    container.scrollTop = container.scrollHeight;
}

function renderWeatherDashboard(data) {
    const card = document.createElement("div");
    card.className = "weather-dashboard";

    // Determine background class
    let bgClass = "bg-default";
    const condition = data.weather[0].main.toLowerCase();
    if (condition.includes("clear")) bgClass = "bg-sunny";
    else if (condition.includes("cloud")) bgClass = "bg-cloudy";
    else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("storm")) bgClass = "bg-rainy";

    // Build the structure
    card.innerHTML = `
        <div class="weather-bg ${bgClass}"></div>
        <div class="weather-overlay"></div>
        <div class="weather-content">
            <div class="weather-header">
                <div>
                    <h3 class="city-name">${data.name}<span class="country-tag">${data.sys.country}</span></h3>
                    <small>${new Date(data.dt * 1000).toLocaleString()}</small>
                </div>
                <div class="weather-icon-container">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" class="weather-icon-large" alt="weather icon">
                </div>
            </div>
            
            <div class="weather-main">
                <span class="weather-temp">${Math.round(data.main.temp - 273.15)}°C</span>
                <div style="margin-left: 20px;">
                    <div class="weather-desc">${data.weather[0].description}</div>
                    <div class="weather-feels">Sensation: ${Math.round(data.main.feels_like - 273.15)}°C</div>
                </div>
            </div>

            <div class="weather-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${data.main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">${data.wind.speed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${data.main.pressure} hPa</span>
                </div>
            </div>
        </div>
    `;

    return card;
}


function createListFromObject(obj) {
    const ul = document.createElement("ul");
    ul.className = "weather-list";

    for (const key in obj) {
        const li = document.createElement("li");
        const keySpan = document.createElement("span");
        keySpan.className = "weather-key";
        keySpan.textContent = `${key}: `;
        li.appendChild(keySpan);

        const val = obj[key];
        if (typeof val === 'object' && val !== null) {
            if (Array.isArray(val)) {
                val.forEach(item => {
                    if (typeof item === 'object') {
                        li.appendChild(createListFromObject(item));
                    } else {
                        const valSpan = document.createElement("span");
                        valSpan.className = "weather-value";
                        valSpan.textContent = item;
                        li.appendChild(valSpan);
                    }
                });
            } else {
                li.appendChild(createListFromObject(val));
            }
        } else {
            const valSpan = document.createElement("span");
            valSpan.className = "weather-value";
            valSpan.textContent = val;
            li.appendChild(valSpan);
        }
        ul.appendChild(li);
    }
    return ul;
}



function onOpen(evt) {
    document.getElementById("enviar").disabled = false;
    console.log("Conexion abierta")
}

function onClose(evt) {
    document.getElementById("enviar").disabled = true;
    console.log("Conexion cerrada");
    setTimeout(() => {
        wsConnect()
    }, 2000);
}

function doSend(msg) {
    let objMensaje = {};
    if (msg.indexOf('clima') > -1) {
        objMensaje.message = "clima",
            objMensaje.query = msg.split(',')[1];
    } else {
        objMensaje.message = msg;
        console.log(objMensaje);
    }
    webSocket.send(JSON.stringify(objMensaje));
}

function enviarTexto(event) {
    console.log(event)
    event.preventDefault();
    let campo = event.target.texto;
    doSend(campo.value)
    campo.value = "";

}