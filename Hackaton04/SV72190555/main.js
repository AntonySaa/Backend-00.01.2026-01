// ===============================
// Hackatón 04 - SV72190555 - Javier Gonzales
// ===============================

// ----------------------------------------
// HELPERS GLOBALES
// ----------------------------------------

const mostrarZona = (html) => {
    const zona = document.getElementById("zona-ejercicio");
    zona.style.display = "block";
    zona.innerHTML = html;
    zona.scrollIntoView({ behavior: "smooth", block: "start" });
};

const crearInput = (tipo, id, placeholder, label) => `
    <div class="campo">
        <label for="${id}">${label}</label>
        <input type="${tipo}" id="${id}" placeholder="${placeholder}" />
    </div>`;

const botonCerrar = `<button class="btn-cerrar" onclick="limpiarTodo()">✕ Cerrar</button>`;

const mostrarResultado = (idRes, exito, html) => {
    const el = document.getElementById(idRes);
    el.style.display = "block";
    el.className = exito ? "resultado ok" : "resultado error";
    el.innerHTML = html;
};

// ===============================
// RETO 1
// ===============================

// ---- 1.1  Suma de dos números ----
function ejercicio101() {
    mostrarZona(`
        <h2>Ejercicio 1.1 — Suma de dos números</h2>
        <p>Crea una función que retorne la suma de dos números.</p>
        ${crearInput("number", "r1n1", "Ej: 5",  "Primer número")}
        ${crearInput("number", "r1n2", "Ej: 3",  "Segundo número")}
        <div class="botones">
            <button onclick="calcR101()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res101" class="resultado" style="display:none"></div>
        <pre><code>const suma = (a, b) => a + b;</code></pre>
    `);
}

function calcR101() {
    const a = parseFloat(document.getElementById("r1n1").value);
    const b = parseFloat(document.getElementById("r1n2").value);
    if (isNaN(a) || isNaN(b))
        return mostrarResultado("res101", false, "❌ Ingresa dos números válidos.");
    const suma = (a, b) => a + b;
    mostrarResultado("res101", true, `✅ <strong>${a} + ${b} = ${suma(a, b)}</strong>`);
}

// ---- 1.2  Potencia ----
function ejercicio102() {
    mostrarZona(`
        <h2>Ejercicio 1.2 — Potencia de un número</h2>
        <p>Función que recibe la base y el exponente y retorna base<sup>exp</sup>.</p>
        ${crearInput("number", "r2base", "Ej: 2",  "Base")}
        ${crearInput("number", "r2exp",  "Ej: 3",  "Exponente")}
        <div class="botones">
            <button onclick="calcR102()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res102" class="resultado" style="display:none"></div>
        <pre><code>const potencia = (base, exp) => base ** exp;</code></pre>
    `);
}

function calcR102() {
    const base = parseFloat(document.getElementById("r2base").value);
    const exp  = parseFloat(document.getElementById("r2exp").value);
    if (isNaN(base) || isNaN(exp))
        return mostrarResultado("res102", false, "❌ Ingresa valores numéricos válidos.");
    const potencia = (base, exp) => base ** exp;
    mostrarResultado("res102", true,
        `✅ <strong>${base}<sup>${exp}</sup> = ${potencia(base, exp)}</strong>`);
}

// ---- 1.3  Suma de cubos ----
function ejercicio103() {
    mostrarZona(`
        <h2>Ejercicio 1.3 — Suma de cubos</h2>
        <p>Ingresa números separados por coma. Se calculará la suma de sus cubos.</p>
        <p class="ejemplo">sumOfCubes(1, 5, 9) ➞ 855</p>
        <div class="campo">
            <label for="r3nums">Números (separados por coma)</label>
            <input type="text" id="r3nums" placeholder="Ej: 1, 5, 9" />
        </div>
        <div class="botones">
            <button onclick="calcR103()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res103" class="resultado" style="display:none"></div>
        <pre><code>const sumOfCubes = (...nums) => nums.reduce((acc, n) => acc + n ** 3, 0);</code></pre>
    `);
}

function calcR103() {
    const nums = document.getElementById("r3nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (nums.some(isNaN))
        return mostrarResultado("res103", false, "❌ Ingresa solo números separados por coma.");
    const sumOfCubes = (...nums) => nums.reduce((acc, n) => acc + n ** 3, 0);
    const pasos = nums.map(n => `${n}³ (${n ** 3})`).join(" + ");
    mostrarResultado("res103", true,
        `✅ <strong>${pasos} = ${sumOfCubes(...nums)}</strong>`);
}

// ---- 1.4  Área del triángulo ----
function ejercicio104() {
    mostrarZona(`
        <h2>Ejercicio 1.4 — Área de un triángulo</h2>
        <p>Fórmula: <strong>Área = (base × altura) / 2</strong></p>
        <p class="ejemplo">triArea(3, 2) ➞ 3</p>
        ${crearInput("number", "r4base",  "Ej: 3", "Base")}
        ${crearInput("number", "r4altura","Ej: 2", "Altura")}
        <div class="botones">
            <button onclick="calcR104()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res104" class="resultado" style="display:none"></div>
        <pre><code>const triArea = (base, altura) => (base * altura) / 2;</code></pre>
    `);
}

function calcR104() {
    const base   = parseFloat(document.getElementById("r4base").value);
    const altura = parseFloat(document.getElementById("r4altura").value);
    if (isNaN(base) || isNaN(altura))
        return mostrarResultado("res104", false, "❌ Ingresa valores válidos.");
    const triArea = (b, h) => (b * h) / 2;
    mostrarResultado("res104", true,
        `✅ Área = (${base} × ${altura}) / 2 = <strong>${triArea(base, altura)}</strong>`);
}

// ---- 1.5  Calculadora ----
function ejercicio105() {
    mostrarZona(`
        <h2>Ejercicio 1.5 — Calculadora</h2>
        <p>Recibe dos números y una operación matemática: <code>+ - / x %</code></p>
        <p class="ejemplo">calculator(2, "+", 2) ➞ 4</p>
        ${crearInput("number", "r5n1", "Ej: 2", "Primer número")}
        <div class="campo">
            <label for="r5op">Operación</label>
            <select id="r5op">
                <option value="+">+ &nbsp; Suma</option>
                <option value="-">−  &nbsp; Resta</option>
                <option value="x">x &nbsp; Multiplicación</option>
                <option value="/">/  &nbsp; División</option>
                <option value="%">% &nbsp; Módulo</option>
            </select>
        </div>
        ${crearInput("number", "r5n2", "Ej: 2", "Segundo número")}
        <div class="botones">
            <button onclick="calcR105()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res105" class="resultado" style="display:none"></div>
        <pre><code>const calculator = (a, op, b) => {
  switch(op) {
    case "+": return a + b;
    case "-": return a - b;
    case "x": return a * b;
    case "/": return b !== 0 ? a / b : "Error: división por cero";
    case "%": return a % b;
    default:  return "El parámetro no es reconocido";
  }
};</code></pre>
    `);
}

function calcR105() {
    const a  = parseFloat(document.getElementById("r5n1").value);
    const op = document.getElementById("r5op").value;
    const b  = parseFloat(document.getElementById("r5n2").value);
    if (isNaN(a) || isNaN(b))
        return mostrarResultado("res105", false, "❌ Ingresa números válidos.");

    const calculator = (a, op, b) => {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "x": return a * b;
            case "/": return b !== 0 ? a / b : "Error: división por cero";
            case "%": return a % b;
            default:  return "El parámetro no es reconocido";
        }
    };

    const res = calculator(a, op, b);
    const exito = typeof res === "number";
    mostrarResultado("res105", exito,
        exito
            ? `✅ <strong>${a} ${op} ${b} = ${res}</strong>`
            : `❌ ${res}`);
}

// ---- 1.6  Preguntas teóricas ----
function ejercicio106() {
    mostrarZona(`
        <h2>Ejercicio 1.6 — Preguntas teóricas</h2>

        <h3>¿Cómo defines una función?</h3>
        <p>En JavaScript existen <strong>tres formas principales</strong>:</p>
        <pre><code>// 1. Declaración de función (hoisting: sí)
function sumar(a, b) {
    return a + b;
}

// 2. Expresión de función (hoisting: no)
const sumar = function(a, b) {
    return a + b;
};

// 3. Arrow function — ES6 (hoisting: no, sin propio "this")
const sumar = (a, b) => a + b;</code></pre>

        <h3>¿Hasta cuántos argumentos puede tener una función?</h3>
        <p>
            JavaScript <strong>no impone un límite fijo</strong> en el lenguaje.
            Los motores modernos (V8, SpiderMonkey) soportan hasta
            <strong>~65 535</strong> argumentos explícitos antes de lanzar un error de stack.
        </p>
        <p>
            Con <strong>rest parameters</strong> (<code>...args</code>) puedes recibir
            una cantidad arbitraria sin declarar cada uno:
        </p>
        <pre><code>const sumarTodo = (...nums) => nums.reduce((a, b) => a + b, 0);
sumarTodo(1, 2, 3, 4, 5); // ➞ 15</code></pre>
        <p>
            La buena práctica recomienda <strong>no más de 3–4 parámetros</strong>;
            si necesitas más, agrúpalos en un objeto.
        </p>

        <div class="botones">${botonCerrar}</div>
    `);
}

// ---- 1.7  Validar número de 3 dígitos ----
// (ejercicio bonus que tenías originalmente en el main viejo)
function ejercicio107() {
    mostrarZona(`
        <h2>Ejercicio 1.7 — Validar número de 3 dígitos</h2>
        <p>Determina si el número ingresado tiene exactamente 3 dígitos.</p>
        ${crearInput("number", "r7num", "Ej: 123", "Número")}
        <div class="botones">
            <button onclick="calcR107()">Validar</button>
            ${botonCerrar}
        </div>
        <div id="res107" class="resultado" style="display:none"></div>
        <pre><code>const tieneTresDigitos = (n) => {
    const abs = Math.abs(Math.trunc(n));
    return abs >= 100 && abs <= 999;
};</code></pre>
    `);
}

function calcR107() {
    const n = parseInt(document.getElementById("r7num").value);
    if (isNaN(n))
        return mostrarResultado("res107", false, "❌ Ingresa un número entero válido.");
    const tieneTresDigitos = (n) => { const a = Math.abs(Math.trunc(n)); return a >= 100 && a <= 999; };
    const ok = tieneTresDigitos(n);
    mostrarResultado("res107", ok,
        ok ? `✅ <strong>${n}</strong> sí tiene 3 dígitos.`
           : `❌ <strong>${n}</strong> no tiene 3 dígitos.`);
}


// ===============================
// RETO 2
// ===============================

// ---- 2.01  Presentación con arrow function ----
function ejercicio201() {
    mostrarZona(`
        <h2>Ejercicio 2.01 — Presentación personal</h2>
        <p>Arrow function que recibe nombre, apellido y edad y retorna un string.</p>
        <p class="ejemplo">"Hola mi nombre es sebastián yabiku y mi edad 33"</p>
        ${crearInput("text",   "r201nom", "Ej: Sebastián", "Nombre")}
        ${crearInput("text",   "r201ape", "Ej: Yabiku",    "Apellido")}
        ${crearInput("number", "r201eda", "Ej: 33",        "Edad")}
        <div class="botones">
            <button onclick="calcR201()">Generar</button>
            ${botonCerrar}
        </div>
        <div id="res201" class="resultado" style="display:none"></div>
        <pre><code>const presentacion = (nombre, apellido, edad) =>
    \`Hola mi nombre es \${nombre} \${apellido} y mi edad \${edad}\`;</code></pre>
    `);
}
function calcR201() {
    const nom = document.getElementById("r201nom").value.trim();
    const ape = document.getElementById("r201ape").value.trim();
    const eda = document.getElementById("r201eda").value.trim();
    if (!nom || !ape || !eda)
        return mostrarResultado("res201", false, "❌ Completa todos los campos.");
    const presentacion = (nombre, apellido, edad) =>
        `Hola mi nombre es ${nombre} ${apellido} y mi edad ${edad}`;
    mostrarResultado("res201", true, `✅ <strong>"${presentacion(nom, ape, eda)}"</strong>`);
}

// ---- 2.02  Suma de cubos (rest params) ----
function ejercicio202() {
    mostrarZona(`
        <h2>Ejercicio 2.02 — Suma de cubos</h2>
        <p>Usa <strong>rest parameters</strong> para recibir N números y sumar sus cubos.</p>
        <p class="ejemplo">sumOfCubes(1, 5, 9) ➞ 855</p>
        <div class="campo">
            <label>Números separados por coma</label>
            <input type="text" id="r202nums" placeholder="Ej: 1, 5, 9" />
        </div>
        <div class="botones">
            <button onclick="calcR202()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res202" class="resultado" style="display:none"></div>
        <pre><code>const sumOfCubes = (...nums) =>
    nums.reduce((acc, n) => acc + n ** 3, 0);</code></pre>
    `);
}
function calcR202() {
    const nums = document.getElementById("r202nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (nums.some(isNaN))
        return mostrarResultado("res202", false, "❌ Solo números separados por coma.");
    const sumOfCubes = (...nums) => nums.reduce((acc, n) => acc + n ** 3, 0);
    const pasos = nums.map(n => `${n}³=${n**3}`).join(" + ");
    mostrarResultado("res202", true, `✅ ${pasos} = <strong>${sumOfCubes(...nums)}</strong>`);
}

// ---- 2.03  Tipo de valor ----
function ejercicio203() {
    mostrarZona(`
        <h2>Ejercicio 2.03 — Tipo de valor</h2>
        <p>Retorna el tipo del valor usando <code>typeof</code>. Prueba cada opción.</p>
        <div class="campo">
            <label>Selecciona un valor</label>
            <select id="r203sel">
                <option value="number">42  →  number</option>
                <option value="string">"Hola"  →  string</option>
                <option value="boolean">true  →  boolean</option>
                <option value="undefined">undefined  →  undefined</option>
                <option value="object_null">null  →  object  ⚠️ particularidad JS</option>
                <option value="object_obj">{}  →  object</option>
                <option value="object_arr">[]  →  object</option>
                <option value="function">() => {}  →  function</option>
            </select>
        </div>
        <div class="botones">
            <button onclick="calcR203()">Obtener tipo</button>
            ${botonCerrar}
        </div>
        <div id="res203" class="resultado" style="display:none"></div>
        <pre><code>const obtenerTipo = (valor) => typeof valor;

obtenerTipo(42);          // "number"
obtenerTipo("Hola");      // "string"
obtenerTipo(true);        // "boolean"
obtenerTipo(undefined);   // "undefined"
obtenerTipo(null);        // "object"  ← bug histórico de JS
obtenerTipo({});          // "object"
obtenerTipo([]);          // "object"
obtenerTipo(() => {});    // "function"</code></pre>
    `);
}
function calcR203() {
    const mapa = {
        number:      { val: 42,         tipo: "number",    repr: "42" },
        string:      { val: "Hola",     tipo: "string",    repr: '"Hola"' },
        boolean:     { val: true,        tipo: "boolean",   repr: "true" },
        undefined:   { val: undefined,   tipo: "undefined", repr: "undefined" },
        object_null: { val: null,        tipo: "object",    repr: "null" },
        object_obj:  { val: {},          tipo: "object",    repr: "{}" },
        object_arr:  { val: [],          tipo: "object",    repr: "[]" },
        function:    { val: () => {},    tipo: "function",  repr: "() => {}" },
    };
    const { val, tipo, repr } = mapa[document.getElementById("r203sel").value];
    const obtenerTipo = (v) => typeof v;
    mostrarResultado("res203", true,
        `✅ <code>typeof ${repr}</code> → <strong>"${obtenerTipo(val)}"</strong>`);
}

// ---- 2.04  Sumar N argumentos (rest) ----
function ejercicio204() {
    mostrarZona(`
        <h2>Ejercicio 2.04 — Sumar N argumentos</h2>
        <p>Recibe <strong>N cantidad</strong> de argumentos con rest parameters y los suma.</p>
        <div class="campo">
            <label>Números separados por coma</label>
            <input type="text" id="r204nums" placeholder="Ej: 1, 2, 3, 4, 5" />
        </div>
        <div class="botones">
            <button onclick="calcR204()">Sumar</button>
            ${botonCerrar}
        </div>
        <div id="res204" class="resultado" style="display:none"></div>
        <pre><code>const sumarTodo = (...nums) =>
    nums.reduce((acc, n) => acc + n, 0);</code></pre>
    `);
}
function calcR204() {
    const nums = document.getElementById("r204nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (nums.some(isNaN))
        return mostrarResultado("res204", false, "❌ Solo números separados por coma.");
    const sumarTodo = (...nums) => nums.reduce((acc, n) => acc + n, 0);
    mostrarResultado("res204", true,
        `✅ ${nums.join(" + ")} = <strong>${sumarTodo(...nums)}</strong>`);
}

// ---- 2.05  Filtrar valores que NO son string ----
function ejercicio205() {
    mostrarZona(`
        <h2>Ejercicio 2.05 — Filtrar no-strings</h2>
        <p>Recibe un array mixto y devuelve solo los valores que <strong>no son string</strong>.</p>
        <div class="campo">
            <label>Array mixto (coma-separado, usa comillas para strings)</label>
            <input type="text" id="r205arr" placeholder='Ej: 1, "hola", true, "mundo", 42' />
        </div>
        <div class="botones">
            <button onclick="calcR205()">Filtrar</button>
            ${botonCerrar}
        </div>
        <div id="res205" class="resultado" style="display:none"></div>
        <pre><code>const filtrarNoStrings = (arr) =>
    arr.filter(item => typeof item !== "string");</code></pre>
    `);
}
function calcR205() {
    let arr;
    try { arr = JSON.parse("[" + document.getElementById("r205arr").value + "]"); }
    catch { return mostrarResultado("res205", false, "❌ Formato inválido. Usa comillas en los strings."); }
    const filtrarNoStrings = (arr) => arr.filter(item => typeof item !== "string");
    const res = filtrarNoStrings(arr);
    mostrarResultado("res205", true,
        `✅ Resultado: <strong>[${res.map(v => JSON.stringify(v)).join(", ")}]</strong>`);
}

// ---- 2.06  Min y Max ----
function ejercicio206() {
    mostrarZona(`
        <h2>Ejercicio 2.06 — Mínimo y Máximo</h2>
        <p>Devuelve <code>[min, max]</code> de un array de números.</p>
        <p class="ejemplo">minMax([1, 2, 3, 4, 5]) ➞ [1, 5]</p>
        <div class="campo">
            <label>Números separados por coma</label>
            <input type="text" id="r206nums" placeholder="Ej: 1, 2, 3, 4, 5" />
        </div>
        <div class="botones">
            <button onclick="calcR206()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res206" class="resultado" style="display:none"></div>
        <pre><code>const minMax = (arr) => [Math.min(...arr), Math.max(...arr)];</code></pre>
    `);
}
function calcR206() {
    const nums = document.getElementById("r206nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (nums.some(isNaN))
        return mostrarResultado("res206", false, "❌ Solo números separados por coma.");
    const minMax = (arr) => [Math.min(...arr), Math.max(...arr)];
    const [mn, mx] = minMax(nums);
    mostrarResultado("res206", true,
        `✅ Min: <strong>${mn}</strong> &nbsp;|&nbsp; Max: <strong>${mx}</strong> &nbsp;→ <strong>[${mn}, ${mx}]</strong>`);
}

// ---- 2.07  Formato de número telefónico ----
function ejercicio207() {
    mostrarZona(`
        <h2>Ejercicio 2.07 — Número de teléfono</h2>
        <p>Toma un array de 10 dígitos y devuelve formato telefónico.</p>
        <p class="ejemplo">formatPhoneNumber([1,2,3,4,5,6,7,8,9,0]) ➞ "(123) 456-7890"</p>
        <div class="campo">
            <label>10 dígitos separados por coma</label>
            <input type="text" id="r207dig" placeholder="Ej: 1, 2, 3, 4, 5, 6, 7, 8, 9, 0" />
        </div>
        <div class="botones">
            <button onclick="calcR207()">Formatear</button>
            ${botonCerrar}
        </div>
        <div id="res207" class="resultado" style="display:none"></div>
        <pre><code>const formatPhoneNumber = (arr) =>
    \`(\${arr.slice(0,3).join("")}) \${arr.slice(3,6).join("")}-\${arr.slice(6).join("")}\`;</code></pre>
    `);
}
function calcR207() {
    const arr = document.getElementById("r207dig").value
        .split(",").map(n => parseInt(n.trim()));
    if (arr.length !== 10 || arr.some(isNaN))
        return mostrarResultado("res207", false, "❌ Ingresa exactamente 10 dígitos (0-9).");
    const formatPhoneNumber = (arr) =>
        `(${arr.slice(0,3).join("")}) ${arr.slice(3,6).join("")}-${arr.slice(6).join("")}`;
    mostrarResultado("res207", true, `✅ <strong>${formatPhoneNumber(arr)}</strong>`);
}

// ---- 2.08  Mayor de cada subarray ----
function ejercicio208() {
    mostrarZona(`
        <h2>Ejercicio 2.08 — Mayor de cada subarray</h2>
        <p>Devuelve el número más grande de cada subarray.</p>
        <p class="ejemplo">findLargestNums([[4,2,7,1],[20,70,40,90],[1,2,0]]) ➞ [7, 90, 2]</p>
        <div class="campo">
            <label>Array de arrays (formato JSON)</label>
            <input type="text" id="r208arr" placeholder="Ej: [[4,2,7],[20,70,40],[1,2,0]]" />
        </div>
        <div class="botones">
            <button onclick="calcR208()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res208" class="resultado" style="display:none"></div>
        <pre><code>const findLargestNums = (arr) =>
    arr.map(sub => Math.max(...sub));</code></pre>
    `);
}
function calcR208() {
    let arr;
    try { arr = JSON.parse(document.getElementById("r208arr").value); }
    catch { return mostrarResultado("res208", false, "❌ Formato JSON inválido. Ej: [[4,2],[1,3]]"); }
    if (!Array.isArray(arr) || !arr.every(Array.isArray))
        return mostrarResultado("res208", false, "❌ Debe ser un array de arrays.");
    const findLargestNums = (arr) => arr.map(sub => Math.max(...sub));
    mostrarResultado("res208", true,
        `✅ <strong>[${findLargestNums(arr).join(", ")}]</strong>`);
}

// ---- 2.09  Primer y último índice de un carácter ----
function ejercicio209() {
    mostrarZona(`
        <h2>Ejercicio 2.09 — Índices de un carácter</h2>
        <p>Devuelve el <strong>primer</strong> y <strong>último</strong> índice de un carácter en una palabra.</p>
        <p class="ejemplo">charIndex("hello", "l") ➞ [2, 3]</p>
        ${crearInput("text", "r209pal", 'Ej: hello',  "Palabra")}
        ${crearInput("text", "r209car", 'Ej: l',      "Carácter (1 solo)")}
        <div class="botones">
            <button onclick="calcR209()">Buscar</button>
            ${botonCerrar}
        </div>
        <div id="res209" class="resultado" style="display:none"></div>
        <pre><code>const charIndex = (str, ch) =>
    [str.indexOf(ch), str.lastIndexOf(ch)];</code></pre>
    `);
}
function calcR209() {
    const str = document.getElementById("r209pal").value;
    const ch  = document.getElementById("r209car").value;
    if (!str || ch.length !== 1)
        return mostrarResultado("res209", false, "❌ Ingresa una palabra y exactamente 1 carácter.");
    const charIndex = (str, ch) => [str.indexOf(ch), str.lastIndexOf(ch)];
    const [first, last] = charIndex(str, ch);
    if (first === -1)
        return mostrarResultado("res209", false, `❌ El carácter <strong>"${ch}"</strong> no existe en "${str}".`);
    mostrarResultado("res209", true,
        `✅ "<strong>${ch}</strong>" en "<strong>${str}</strong>" → primero: <strong>${first}</strong>, último: <strong>${last}</strong> → <strong>[${first}, ${last}]</strong>`);
}

// ---- 2.10  Objeto a array de pares ----
function ejercicio210() {
    mostrarZona(`
        <h2>Ejercicio 2.10 — Objeto a array</h2>
        <p>Convierte un objeto en array de pares <code>[clave, valor]</code>.</p>
        <p class="ejemplo">toArray({ a: 1, b: 2 }) ➞ [["a", 1], ["b", 2]]</p>
        <div class="campo">
            <label>Objeto (formato JSON)</label>
            <input type="text" id="r210obj" placeholder='Ej: { "a": 1, "b": 2 }' />
        </div>
        <div class="botones">
            <button onclick="calcR210()">Convertir</button>
            ${botonCerrar}
        </div>
        <div id="res210" class="resultado" style="display:none"></div>
        <pre><code>const toArray = (obj) => Object.entries(obj);</code></pre>
    `);
}
function calcR210() {
    let obj;
    try { obj = JSON.parse(document.getElementById("r210obj").value); }
    catch { return mostrarResultado("res210", false, "❌ JSON inválido. Usa comillas dobles en las claves."); }
    const toArray = (obj) => Object.entries(obj);
    const res = toArray(obj).map(([k, v]) => `["${k}", ${JSON.stringify(v)}]`).join(", ");
    mostrarResultado("res210", true, `✅ <strong>[${res}]</strong>`);
}

// ---- 2.11  Suma de presupuestos ----
function ejercicio211() {
    mostrarZona(`
        <h2>Ejercicio 2.11 — Suma de presupuestos</h2>
        <p>Suma la propiedad <code>budget</code> de cada objeto en un array.</p>
        <p class="ejemplo">getBudgets([...]) ➞ 65700</p>
        <div class="campo">
            <label>Agregar persona</label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                <input type="text"   id="r211nom" placeholder="Nombre" />
                <input type="number" id="r211age" placeholder="Edad" />
                <input type="number" id="r211bud" placeholder="Budget" />
            </div>
            <button onclick="agregarPersona211()" style="margin-top:8px;width:auto;padding:8px 18px;">+ Agregar</button>
        </div>
        <ul id="r211lista" style="margin:10px 0;padding-left:20px;"></ul>
        <div class="botones">
            <button onclick="calcR211()">Calcular total</button>
            ${botonCerrar}
        </div>
        <div id="res211" class="resultado" style="display:none"></div>
        <pre><code>const getBudgets = (arr) =>
    arr.reduce((total, p) => total + p.budget, 0);</code></pre>
    `);
    window._personas211 = [
        { name: "John",   age: 21, budget: 23000 },
        { name: "Steve",  age: 32, budget: 40000 },
        { name: "Martin", age: 16, budget: 2700  },
    ];
    renderLista211();
}
function renderLista211() {
    document.getElementById("r211lista").innerHTML =
        window._personas211.map((p, i) =>
            `<li>${p.name} (${p.age} años) — $${p.budget.toLocaleString()}
             <button onclick="eliminarPersona211(${i})" style="padding:2px 8px;margin-left:8px;background:linear-gradient(to bottom,#ffe0e0,#ffaaaa);border-color:#ff9999;color:#7a0000;border-radius:6px;cursor:pointer;font-size:.8rem;">✕</button></li>`
        ).join("");
}
function agregarPersona211() {
    const nom = document.getElementById("r211nom").value.trim();
    const age = parseInt(document.getElementById("r211age").value);
    const bud = parseFloat(document.getElementById("r211bud").value);
    if (!nom || isNaN(age) || isNaN(bud))
        return alert("Completa nombre, edad y budget.");
    window._personas211.push({ name: nom, age, budget: bud });
    renderLista211();
    ["r211nom","r211age","r211bud"].forEach(id => document.getElementById(id).value = "");
}
function eliminarPersona211(i) {
    window._personas211.splice(i, 1);
    renderLista211();
}
function calcR211() {
    const getBudgets = (arr) => arr.reduce((total, p) => total + p.budget, 0);
    const total = getBudgets(window._personas211);
    mostrarResultado("res211", true,
        `✅ Total de presupuestos: <strong>$${total.toLocaleString()}</strong>`);
}

// ---- 2.12  Nombres de estudiantes ----
function ejercicio212() {
    mostrarZona(`
        <h2>Ejercicio 2.12 — Nombres de estudiantes</h2>
        <p>Recibe un array de objetos y devuelve solo los nombres.</p>
        <p class="ejemplo">getStudentNames([{name:"Steve"},{name:"Mike"}]) ➞ ["Steve","Mike"]</p>
        <div class="campo">
            <label>Nombres separados por coma</label>
            <input type="text" id="r212noms" placeholder="Ej: Steve, Mike, John" />
        </div>
        <div class="botones">
            <button onclick="calcR212()">Extraer nombres</button>
            ${botonCerrar}
        </div>
        <div id="res212" class="resultado" style="display:none"></div>
        <pre><code>const getStudentNames = (arr) => arr.map(s => s.name);</code></pre>
    `);
}
function calcR212() {
    const noms = document.getElementById("r212noms").value
        .split(",").map(n => n.trim()).filter(Boolean);
    if (!noms.length)
        return mostrarResultado("res212", false, "❌ Ingresa al menos un nombre.");
    const estudiantes = noms.map(n => ({ name: n }));
    const getStudentNames = (arr) => arr.map(s => s.name);
    const res = getStudentNames(estudiantes);
    mostrarResultado("res212", true,
        `✅ <strong>["${res.join('", "')}"]</strong>`);
}

// ---- 2.13  objectToArray ----
function ejercicio213() {
    mostrarZona(`
        <h2>Ejercicio 2.13 — objectToArray</h2>
        <p>Convierte un objeto en array de pares clave-valor con <code>Object.entries()</code>.</p>
        <p class="ejemplo">objectToArray({likes:2, dislikes:3}) ➞ [["likes",2],["dislikes",3]]</p>
        <div class="campo">
            <label>Objeto (formato JSON)</label>
            <input type="text" id="r213obj" placeholder='Ej: {"likes":2,"dislikes":3,"followers":10}' />
        </div>
        <div class="botones">
            <button onclick="calcR213()">Convertir</button>
            ${botonCerrar}
        </div>
        <div id="res213" class="resultado" style="display:none"></div>
        <pre><code>const objectToArray = (obj) => Object.entries(obj);</code></pre>
    `);
}
function calcR213() {
    let obj;
    try { obj = JSON.parse(document.getElementById("r213obj").value); }
    catch { return mostrarResultado("res213", false, "❌ JSON inválido."); }
    const objectToArray = (obj) => Object.entries(obj);
    const res = objectToArray(obj).map(([k,v]) => `["${k}", ${JSON.stringify(v)}]`).join(", ");
    mostrarResultado("res213", true, `✅ <strong>[${res}]</strong>`);
}

// ---- 2.14  Suma de cuadrados ----
function ejercicio214() {
    mostrarZona(`
        <h2>Ejercicio 2.14 — Suma de cuadrados hasta N</h2>
        <p>Dado N, devuelve 1² + 2² + … + N².</p>
        <p class="ejemplo">squaresSum(3) ➞ 14 &nbsp; (1 + 4 + 9)</p>
        ${crearInput("number", "r214n", "Ej: 3", "N")}
        <div class="botones">
            <button onclick="calcR214()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res214" class="resultado" style="display:none"></div>
        <pre><code>const squaresSum = (n) =>
    Array.from({length: n}, (_, i) => (i+1) ** 2)
         .reduce((a, b) => a + b, 0);</code></pre>
    `);
}
function calcR214() {
    const n = parseInt(document.getElementById("r214n").value);
    if (isNaN(n) || n < 1)
        return mostrarResultado("res214", false, "❌ Ingresa un entero positivo.");
    const squaresSum = (n) =>
        Array.from({length: n}, (_, i) => (i+1) ** 2).reduce((a, b) => a + b, 0);
    const pasos = Array.from({length: n}, (_, i) => `${i+1}²=${( i+1)**2}`).join(" + ");
    mostrarResultado("res214", true,
        `✅ ${pasos} = <strong>${squaresSum(n)}</strong>`);
}

// ---- 2.15  Multiplicar por la longitud ----
function ejercicio215() {
    mostrarZona(`
        <h2>Ejercicio 2.15 — Multiplicar por longitud</h2>
        <p>Multiplica cada elemento por la cantidad de elementos del array.</p>
        <p class="ejemplo">multiplyByLength([2,3,1,0]) ➞ [8,12,4,0]</p>
        <div class="campo">
            <label>Números separados por coma</label>
            <input type="text" id="r215nums" placeholder="Ej: 2, 3, 1, 0" />
        </div>
        <div class="botones">
            <button onclick="calcR215()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res215" class="resultado" style="display:none"></div>
        <pre><code>const multiplyByLength = (arr) => arr.map(n => n * arr.length);</code></pre>
    `);
}
function calcR215() {
    const arr = document.getElementById("r215nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (arr.some(isNaN))
        return mostrarResultado("res215", false, "❌ Solo números separados por coma.");
    const multiplyByLength = (arr) => arr.map(n => n * arr.length);
    mostrarResultado("res215", true,
        `✅ Longitud: ${arr.length} → <strong>[${multiplyByLength(arr).join(", ")}]</strong>`);
}

// ---- 2.16  Cuenta regresiva ----
function ejercicio216() {
    mostrarZona(`
        <h2>Ejercicio 2.16 — Cuenta regresiva</h2>
        <p>Devuelve un array contando desde N hasta 0.</p>
        <p class="ejemplo">countdown(5) ➞ [5, 4, 3, 2, 1, 0]</p>
        ${crearInput("number", "r216n", "Ej: 5", "Número inicial")}
        <div class="botones">
            <button onclick="calcR216()">Generar</button>
            ${botonCerrar}
        </div>
        <div id="res216" class="resultado" style="display:none"></div>
        <pre><code>const countdown = (n) =>
    Array.from({length: n + 1}, (_, i) => n - i);</code></pre>
    `);
}
function calcR216() {
    const n = parseInt(document.getElementById("r216n").value);
    if (isNaN(n) || n < 0)
        return mostrarResultado("res216", false, "❌ Ingresa un entero >= 0.");
    const countdown = (n) => Array.from({length: n + 1}, (_, i) => n - i);
    mostrarResultado("res216", true,
        `✅ <strong>[${countdown(n).join(", ")}]</strong>`);
}

// ---- 2.17  Diferencia max - min ----
function ejercicio217() {
    mostrarZona(`
        <h2>Ejercicio 2.17 — Diferencia máx − mín</h2>
        <p>Devuelve la diferencia entre el número mayor y el menor.</p>
        <p class="ejemplo">diffMaxMin([10,4,1,4,-10,-50,32,21]) ➞ 82</p>
        <div class="campo">
            <label>Números separados por coma</label>
            <input type="text" id="r217nums" placeholder="Ej: 10, 4, 1, -50, 32" />
        </div>
        <div class="botones">
            <button onclick="calcR217()">Calcular</button>
            ${botonCerrar}
        </div>
        <div id="res217" class="resultado" style="display:none"></div>
        <pre><code>const diffMaxMin = (arr) => Math.max(...arr) - Math.min(...arr);</code></pre>
    `);
}
function calcR217() {
    const arr = document.getElementById("r217nums").value
        .split(",").map(n => parseFloat(n.trim()));
    if (arr.some(isNaN))
        return mostrarResultado("res217", false, "❌ Solo números separados por coma.");
    const diffMaxMin = (arr) => Math.max(...arr) - Math.min(...arr);
    mostrarResultado("res217", true,
        `✅ Max: ${Math.max(...arr)}, Min: ${Math.min(...arr)} → <strong>${diffMaxMin(arr)}</strong>`);
}

// ---- 2.18  Filtrar solo enteros ----
function ejercicio218() {
    mostrarZona(`
        <h2>Ejercicio 2.18 — Filtrar solo enteros</h2>
        <p>Devuelve solo los valores numéricos de un array mixto.</p>
        <p class="ejemplo">filterList([1, 2, 3, "x", "y", 10]) ➞ [1, 2, 3, 10]</p>
        <div class="campo">
            <label>Array mixto (usa comillas en strings)</label>
            <input type="text" id="r218arr" placeholder='Ej: 1, 2, 3, "x", "y", 10' />
        </div>
        <div class="botones">
            <button onclick="calcR218()">Filtrar</button>
            ${botonCerrar}
        </div>
        <div id="res218" class="resultado" style="display:none"></div>
        <pre><code>const filterList = (arr) => arr.filter(n => typeof n === "number");</code></pre>
    `);
}
function calcR218() {
    let arr;
    try { arr = JSON.parse("[" + document.getElementById("r218arr").value + "]"); }
    catch { return mostrarResultado("res218", false, "❌ Formato inválido. Pon comillas en los strings."); }
    const filterList = (arr) => arr.filter(n => typeof n === "number");
    mostrarResultado("res218", true,
        `✅ <strong>[${filterList(arr).join(", ")}]</strong>`);
}

// ---- 2.19  Repetir elemento ----
function ejercicio219() {
    mostrarZona(`
        <h2>Ejercicio 2.19 — Repetir elemento</h2>
        <p>Repite el primer argumento tantas veces indica el segundo.</p>
        <p class="ejemplo">repeat(13, 5) ➞ [13, 13, 13, 13, 13]</p>
        ${crearInput("text",   "r219elem", "Ej: 13",  "Elemento")}
        ${crearInput("number", "r219veces","Ej: 5",   "Veces")}
        <div class="botones">
            <button onclick="calcR219()">Repetir</button>
            ${botonCerrar}
        </div>
        <div id="res219" class="resultado" style="display:none"></div>
        <pre><code>const repeat = (elem, veces) => Array(veces).fill(elem);</code></pre>
    `);
}
function calcR219() {
    const rawElem = document.getElementById("r219elem").value.trim();
    const veces   = parseInt(document.getElementById("r219veces").value);
    if (!rawElem || isNaN(veces) || veces < 1)
        return mostrarResultado("res219", false, "❌ Ingresa un elemento y un número de veces >= 1.");
    const elem = isNaN(Number(rawElem)) ? rawElem : Number(rawElem);
    const repeat = (elem, veces) => Array(veces).fill(elem);
    mostrarResultado("res219", true,
        `✅ <strong>[${repeat(elem, veces).join(", ")}]</strong>`);
}

// ---- 2.20  vreplace — extender String.prototype ----
function ejercicio220() {
    mostrarZona(`
        <h2>Ejercicio 2.20 — vreplace()</h2>
        <p>Extiende <code>String.prototype</code> para reemplazar todas las vocales por una vocal dada.</p>
        <p class="ejemplo">"apples and bananas".vreplace("u") ➞ "upplus und bununus"</p>
        ${crearInput("text", "r220str",  "Ej: apples and bananas", "Texto")}
        ${crearInput("text", "r220voc",  "Ej: u",                  "Nueva vocal (1 carácter)")}
        <div class="botones">
            <button onclick="calcR220()">Reemplazar</button>
            ${botonCerrar}
        </div>
        <div id="res220" class="resultado" style="display:none"></div>
        <pre><code>String.prototype.vreplace = function(v) {
    return this.replace(/[aeiouAEIOU]/g, v);
};</code></pre>
    `);
}
function calcR220() {
    const str = document.getElementById("r220str").value;
    const voc = document.getElementById("r220voc").value;
    if (!str || voc.length !== 1)
        return mostrarResultado("res220", false, "❌ Ingresa un texto y exactamente 1 vocal.");
    String.prototype.vreplace = function(v) { return this.replace(/[aeiouAEIOU]/g, v); };
    mostrarResultado("res220", true, `✅ <strong>"${str.vreplace(voc)}"</strong>`);
}

// ---- 2.21  Encontrar a Nemo ----
function ejercicio221() {
    mostrarZona(`
        <h2>Ejercicio 2.21 — Encontrar a Nemo</h2>
        <p>Busca la palabra "Nemo" y devuelve su posición ordinal.</p>
        <p class="ejemplo">findNemo("I am finding Nemo !") ➞ "I found Nemo at 4!"</p>
        <div class="campo">
            <label>Frase (debe contener la palabra Nemo)</label>
            <input type="text" id="r221str" placeholder="Ej: I am finding Nemo !" />
        </div>
        <div class="botones">
            <button onclick="calcR221()">Buscar</button>
            ${botonCerrar}
        </div>
        <div id="res221" class="resultado" style="display:none"></div>
        <pre><code>const findNemo = (str) => {
    const pos = str.split(" ").indexOf("Nemo") + 1;
    return pos ? \`I found Nemo at \${pos}!\` : "Nemo not found!";
};</code></pre>
    `);
}
function calcR221() {
    const str = document.getElementById("r221str").value;
    if (!str) return mostrarResultado("res221", false, "❌ Escribe una frase.");
    const findNemo = (str) => {
        const pos = str.split(" ").indexOf("Nemo") + 1;
        return pos ? `I found Nemo at ${pos}!` : "Nemo not found!";
    };
    const res = findNemo(str);
    const ok  = res !== "Nemo not found!";
    mostrarResultado("res221", ok, `${ok ? "✅" : "❌"} <strong>"${res}"</strong>`);
}

// ---- 2.22  Capitalizar última letra ----
function ejercicio222() {
    mostrarZona(`
        <h2>Ejercicio 2.22 — Capitalizar última letra</h2>
        <p>Convierte en mayúscula la última letra de cada palabra.</p>
        <p class="ejemplo">capLast("hello") ➞ "hellO"</p>
        <div class="campo">
            <label>Texto</label>
            <input type="text" id="r222str" placeholder="Ej: hello world" />
        </div>
        <div class="botones">
            <button onclick="calcR222()">Capitalizar</button>
            ${botonCerrar}
        </div>
        <div id="res222" class="resultado" style="display:none"></div>
        <pre><code>const capLast = (str) =>
    str.split(" ")
       .map(w => w.slice(0, -1) + w.slice(-1).toUpperCase())
       .join(" ");</code></pre>
    `);
}
function calcR222() {
    const str = document.getElementById("r222str").value;
    if (!str) return mostrarResultado("res222", false, "❌ Escribe algo.");
    const capLast = (str) =>
        str.split(" ").map(w => w.slice(0, -1) + w.slice(-1).toUpperCase()).join(" ");
    mostrarResultado("res222", true, `✅ <strong>"${capLast(str)}"</strong>`);
}

// ===============================
// Limpiar zona
// ===============================
function limpiarTodo() {
    const zona = document.getElementById("zona-ejercicio");
    if (zona) { zona.style.display = "none"; zona.innerHTML = ""; }
}
