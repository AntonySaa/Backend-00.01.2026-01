// 1️⃣ Suma de dos números
const suma = (a, b) => a + b;

function ejercicio01() {
    const num1 = Number(prompt("Ingrese el primer número"));
    const num2 = Number(prompt("Ingrese el segundo número"));

    const resultado = suma(num1, num2);

    Swal.fire({
        title: "Resultado",
        text: `La suma es: ${resultado}`,
        icon: "success"
    });
}


// 2️⃣ Potencia de un número
const potencia = (base, exponente) => base ** exponente;

function ejercicio02() {
    const base = Number(prompt("Ingrese la base"));
    const exponente = Number(prompt("Ingrese el exponente"));

    const resultado = potencia(base, exponente);

    Swal.fire({
        title: "Resultado",
        text: `La potencia es: ${resultado}`,
        icon: "success"
    });
}


// 3️⃣ Suma de cubos
const sumcubos = (...numeros) =>
    numeros.reduce((acum, num) => acum + num ** 3, 0);

function ejercicio03() {
    const numerosTexto = prompt("Ingrese números separados por coma (ej: 1,5,9)");
    const numeros = numerosTexto.split(",").map(num => Number(num.trim()));

    const resultado = sumcubos(...numeros);

    Swal.fire({
        title: "Resultado",
        text: `La suma de los cubos es: ${resultado}`,
        icon: "success"
    });
}


// 4️⃣ Área de un triángulo
const triArea = (base, altura) => (base * altura) / 2;

function ejercicio04() {
    const base = Number(prompt("Ingrese la base"));
    const altura = Number(prompt("Ingrese la altura"));

    const resultado = triArea(base, altura);

    Swal.fire({
        title: "Resultado",
        text: `El área del triángulo es: ${resultado}`,
        icon: "success"
    });
}


// 5️⃣ Calculator
const calculator = (num1, operacion, num2) => {
    switch (operacion) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "x":
        case "*":
            return num1 * num2;
        case "/":
            return num2 !== 0 ? num1 / num2 : "No se puede dividir entre 0";
        case "%":
            return num1 % num2;
        default:
            return "El parámetro no es reconocido";
    }
};

function ejercicio05() {
    const num1 = Number(prompt("Ingrese el primer número"));
    const operacion = prompt("Ingrese la operación (+, -, x, /, %)");
    const num2 = Number(prompt("Ingrese el segundo número"));

    const resultado = calculator(num1, operacion, num2);

    Swal.fire({
        title: "Resultado",
        text: `${resultado}`,
        icon: typeof resultado === "number" ? "success" : "error"
    });
}



///PRUEBA N°2///



// N°1
const presentacion = (nombre, apellido, edad) =>
  `Hola mi nombre es ${nombre} ${apellido} y mi edad ${edad}`;

// N°2
const sumadecubos = (...nums) =>
  nums.reduce((acc, n) => acc + n ** 3, 0);

// N°3
const tipoDato = (valor) => typeof valor;

// N°4
const sumarTodo = (...numeros) =>
  numeros.reduce((acc, n) => acc + n, 0);

// N°5
const filtrarNoStrings = (arr) =>
  arr.filter(e => typeof e !== "string");

// N°6
const minMax = (arr) =>
  [Math.min(...arr), Math.max(...arr)];

// N°7
const formatPhoneNumber = (arr) =>
  `(${arr.slice(0,3).join("")}) ${arr.slice(3,6).join("")}-${arr.slice(6).join("")}`;

// N°8
const findLargestNums = (arr) =>
  arr.map(subArr => Math.max(...subArr));

// N°9
const charIndex = (palabra, char) =>
  [palabra.indexOf(char), palabra.lastIndexOf(char)];

// N°10
const toArray = (obj) =>
  Object.entries(obj);

// N°11
const getBudgets = (arr) =>
  arr.reduce((acc, obj) => acc + obj.budget, 0);

// N°12
const getStudentNames = (arr) =>
  arr.map(obj => obj.name);

// N°13
const objectToArray = (obj) =>
  Object.entries(obj);

// N°14
const squaresSum = (n) =>
  Array.from({ length: n }, (_, i) => (i + 1) ** 2)
       .reduce((a, b) => a + b, 0);

// N°15
const multiplyByLength = (arr) =>
  arr.map(n => n * arr.length);

// N°16
const countdown = (n) =>
  Array.from({ length: n + 1 }, (_, i) => n - i);

// N°17
const diffMaxMin = (arr) =>
  Math.max(...arr) - Math.min(...arr);

// N°18
const filterList = (arr) =>
  arr.filter(e => Number.isInteger(e));

// N°19
const repeat = (elemento, veces) =>
  Array(veces).fill(elemento);

// N°20
String.prototype.vreplace = function(vocal) {
  return this.replace(/[aeiou]/gi, vocal);
};

// N°21
const findNemo = (frase) => {
  const palabras = frase.split(" ");
  const index = palabras.indexOf("Nemo");
  return index !== -1
    ? `I found Nemo at ${index + 1}!`
    : "Nemo not found";
};

// N°22
const capLast = (str) =>
  str.split(" ")
     .map(p => p.slice(0, -1) + p.slice(-1).toUpperCase())
     .join(" ");
