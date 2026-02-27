function ejercicio0101(){

    console.log("inicio de ejercicio 01");

    function sumar(a,b){
    return a + b
  }
  let a = parseFloat(prompt("Ingresa el primer numero: "));
  let b = parseFloat(prompt("Ingresa el numero: "))

 if (isNaN(a) || isNaN(b)) {
     alert("Ingresa numeros validos");
    return;
 }

  let resultado = sumar(a,b)
  Swal.fire({
      title: "Respuesta",
      text: "La suma es de: " + resultado,
      icon: "success"
    })

    console.log("Fin del ejercicio 01")
}

function ejercicio0201(){

    console.log("Inicio de ejercicio 02");

    function potencia(base, exponente){
        return Math.pow(base, exponente);
    }

    let base = parseInt(prompt("Ingresa la base:"));
    let exponente = parseInt(prompt("Ingresa el exponente: "));

    if (isNaN(base) || isNaN(exponente)) {
        alert("Ingresa numeros validos");
        return;
    }

    let resultado = potencia(base, exponente);
    Swal.fire({
      title: "Respuesta",
      text: base + " elevado a " + exponente + " es " + resultado,
      icon: "success"
    })


    console.log("Fin de ejercicio 02")
}

function ejercicio0301(){

    console.log("Inicio de ejercicio 03");

    function sumOfCubes(...numeros){
        let suma = 0;
        for(let num of numeros){
            suma += num ** 3;
        }
        return suma;
    }

    let entrada = prompt("Ingresa los numeros separados por comas (ej: 1,2,3): ");
    let numeros = entrada.split(",").map(num => parseFloat(num.trim()));

    if (numeros.some(isNaN)){
        alert("Ingresa solo numeros validos");
        return;
    }

    let resultado = sumOfCubes(...numeros);
    Swal.fire({
      title: "Respuesta",
      text: "La suma de los cubos de los tres numeros es: " + resultado,
      icon: "success"
    })

    console.log("Fin de ejercicio 03")
}

function ejercicio0401(){

    console.log("Inicio de ejercicio 04");

    function triArea(base, altura){
        return (base * altura) / 2
    }

    let base = parseFloat(prompt("Ingrese la base del triangulo: "));
    let altura = parseFloat(prompt("Ingresa la altura del triangulo: "));

    if (isNaN(base) || isNaN(altura)) {
        alert("Ingresa numeros validos");
        return;
    }

    let resultado = triArea(base, altura);
    Swal.fire({
      title: "Respuesta",
      text: "El area del triangulo es de: " + resultado,
      icon: "success"
    })

    console.log("Fin de ejercicio 04");
}

function ejercicio0501(){

    console.log("Inicio de ejercicio 5");

    function Calculator(a, operador, c){
        switch (operador){
            case `+`:
                return a + c;
                break;
            case `-`:
                return a - c;
                break;
            case `*`:
                return a * c;
                break;
            case `/`:
                return a / c;
            default:
                return "operador no valido";
        }
    }
    let a = parseInt(prompt("Inserte el primer numero: ")); 
    let operador = prompt("Inserta un operador: ");
    let c = parseInt(prompt("Inserte el segundo numero: "));

    if (isNaN(a) || isNaN(c)){
        alert("Numero ingresado no es valido")
    }

    let resultado = Calculator(a, operador, c)
    Swal.fire({
      title: "Respuesta",
      text: "El resultado es: " + resultado,
      icon: "success"
    })
    console.log("Fin de ejercicio 05");
}

function ejercicio01(){

    console.log("Inicio del ejercicio 1");

    const datos = (nombre, apellido, edad) =>
        `Hola mi nombre es ${nombre} ${apellido} y mi edad es ${edad} años`

    let nombre = prompt("Ingresa tu nombre: ");
    let apellido = prompt("Ingresa tu apellido: ");
    let edad = prompt ("Ingresa tu edad: ");

    let resultado = datos(nombre, apellido, edad);

    Swal.fire({
      title: "Respuesta",
      text: resultado,
      icon: "success"
    })
    console.log("Fin del ejercicio 01");
}

function ejercicio02(){

    console.log("Inicio de ejercicio 2");

     function sumOfCubes(...numeros){
        let suma = 0;
        for(let num of numeros){
            suma += num ** 3;
        }
        return suma;
    }

    let entrada = prompt("Ingresa los numeros separados por comas (ej: 1,2,3): ");
    let numeros = entrada.split(",").map(num => parseFloat(num.trim()));

    if (numeros.some(isNaN)){
        alert("Ingresa solo numeros validos");
        return;
    }

    let resultado = sumOfCubes(...numeros);
    Swal.fire({
      title: "Respuesta",
      text: "La suma de los cubos de los tres numeros es: " + resultado,
      icon: "success"
    })

    console.log("Fin de ejercicio 2");

}

function ejercicio03(){

    console.log("Inicio de ejercicio 3");

    function obtener(valor){
        if (valor === null) return "null";
        if (Array.isArray(valor)) return "array";
        return typeof (valor);
    }

    let dato = prompt("Ingresa un valor");

    let valorFinal = isNaN(dato) ? dato : Number(dato);

    Swal.fire({
      title: "Respuesta",
      text: "El tipo de dato es: " + obtener(valorFinal),
      icon: "success"
    })
    console.log("Fin de ejercicio 3");

}

function ejercicio04(){

    console.log("Inicio de ejercicio 4");

    function sumar(...numeros) {
        return numeros.reduce((total, numero) => total + numero, 0);
    }
    let cantidad = parseInt(prompt("¿Cuantos numerno desea sumar?"));
    let valores = [];

    for (let i = 0; i < cantidad; i++){
        let numero = parseFloat(prompt("Ingresa el numero " + (i + 1 ) + ":"));
        valores.push(numero);
    }
    let resultado = sumar(...valores);

    Swal.fire({
      title: "Respuesta",
      text: "La suma total es: " + resultado,
      icon: "success"
    })
    console.log("Fin de ejercicio 4");
}

function ejercicio05(){

    console.log("Inicio de ejercicio 5");

    function noString(valores){
        return valores.filter(valor => typeof valor !== "string");
    }

    let ingreso = prompt("Ingresa valores separados por coma: ");
    let arreglo = entrada.split(",").map(valor => { valor = valor.trim()});

    if (isNaN(valor) && valor !== ""){
        return Number(valor);
    } 
    if ( valor === "true") return true;
    if (valor === "false") return false;
    return valor
    let resultado = noString(arreglo);
    Swal.fire({
      title: "Respuesta",
      text: "Valores que no son string: " + JSON.stringify(resultado),
      icon: "success"
    })

    console.log("Fin de ejercicio 5");
}

function ejercicio06(){

    console.log("Inicio de ejercicio 6");
    
    function orden(numeros){
        let minimo = numeros[0];
        let maximo = numeros[0];

        for (let numero of numeros){
            if (numero < minimo) minimo = numero;
            if (numero > maximo) maximo = numero;
        }

        return [minimo, maximo];
    }
    let entrada = prompt("Ingresa numeros separados por coma: ");
    let arreglo = entrada.split(",").map(valor => Number(valor.trim()));
    let resultado = orden(arreglo);

    Swal.fire({
      title: "Respuesta",
      text: "Minimo: " + resultado[0] + "\nMaximo: " + resultado[1],
      icon: "success"
    })

    console.log("Fin de ejercicio 6");

}

function ejercicio07(){

    console.log("Inicio de ejercicio 7");

    function formatPhoneNumber(numeros){
        return `(${numeros[1]}${numeros[2]}${numeros[3]}) ${numeros[4]}${numeros[5]}${numeros[6]}-${numeros[7]}${numeros[8]}${numeros[9]}${numeros[0]}`;
    }
    let datos = prompt("Ingresa 10 nuermos entre 0 y 9 separados por comas");
    let arreglo = entrada.split(",").map(num => Number(num.trim()));
    let esValido = arreglo.length === 10 && arreglo.every(num => num >= 0 && num <= 9 && Number.isInteger(num));

    if (esValido){
        let resultado = formatPhoneNumber(arreglo);
        Swal.fire({
          title: "Respuesta",
          text: "Numero en formato telefonico: " + resultado[1],
          icon: "success"
        })
    } else {
        alert("Error: debes ingresar exactamente 10 numeros enteros, entre el 0 y el 9")
    }
    console.log("Fin de ejercicio 7");

}

function ejercicio08(){

    console.log("Inicio de ejercicio 8");

    function nums(matriz){
        return matriz. map(subMatriz => Math.max(...subMatriz));
    }
    let entrada = prompt(
        "Ingresa las matrices separadas por punto y coma.\n" +
        "Ejemplo:, 4,1;1,8;70,50"
    );

    let matriz = entrada.split(";").map(grupo => grupo.split(",").map(num => Number(num.trim())));
    let resultado = nums(matriz);

    Swal.fire({
          title: "Respuesta",
          text: "El numero mayor de cada matriz es: " + JSON.stringify(resultado),
          icon: "success"
        })
    console.log("Fin de ejercicio 8");
}

function ejercicio09(){

    console.log("Inicio de ejercicio 9");

    function indices(palabra, caracter){
        let primerIndice = palabra.indexOf(caracter);
        let ultimoIndice = palabra.lastIndexOf(caracter);

        return [primerIndice, ultimoIndice];
    };

    let palabra = prompt("Ingresa una palabra:");
    let caracter = prompt("Ingresa un caracter:");
    let resultado = indices(palabra, caracter);

    Swal.fire({
          title: "Respuesta",
          text: "Primer indice: " + resultado[0] + " ultimo indice: " + resultado[1],
          icon: "success"
    })

    console.log("Fin de ejercicio 9");
}

function ejercicio10(){

    console.log("Inicio de ejercicio 10");

    function Array(objeto){
        return Object.entries(objeto);
    }

    let dato = prompt("Ingrese pares clave:valor separados por coma. Ejemplo: a:1,b:2");
    let objeto ={};
    let pares = entrada.aplit(",");

    for (let par of pares) {
        let [clave, valor] = par.split(":");

        clave = clave.trim();
        valor = valor.trim();
        objeto[clave] = valor;
    }

    let resultado =Array(objeto);
    Swal.fire({
          title: "Respuesta",
          text: "Resultado: " + resultado,
          icon: "success"
    })
    console.log("Fin de ejercicio 10");
}

function ejercicio11(){

    console.log("Inicio de ejercicio 11");

    function suma(personas) {
        return personas.reduce((total, persona) => total + persona.presupuesto, 0);
    }
    let cantidad = parseInt(prompt("¿Cuantas personas desea ingresar?"));
    let personas =[];

    for (let i = 0; i < cantidad; i++){
        let nombre = prompt("Ingresas el nombre de la persona: " + (i + 1));
        let edad = parseInt(prompt("Ingresa la edad de " + nombre));
        let presupuesto = parseFloat(prompt("Ingresa el presupuesto de " + nombre));

        personas.push({
            nombre: nombre,
            edad: edad,
            presupuesto: presupuesto
        });
        let total = suma(personas);
        Swal.fire({
          title: "Respuesta",
          text: "La suma total de los presupuestos es: " + total,
          icon: "success"
        })

    }
    console.log("Fin de ejercicio 11");
}

function ejercicio12(){

    console.log("Inicio de ejercicio 12");

    function nombreEstudiantes(estudiantes){
        return estudiantes.map(estudiante => estudiante.nombre);
    }

    let cantidad = parseInt(prompt("Ingrese la cantidad de estudiantes que desea ingresar: "));
    let estudiantes = [];

     for (let i = 0; i < cantidad; i++){
        let nombre = prompt("Ingrese el nombre del estudiante: " + (i + 1));
     }

     let resultado = nombreEstudiantes(estudiantes);

     Swal.fire({
          title: "Respuesta",
          text: "Nombres de estudiantes" + JSON.stringify(resultado),
          icon: "success"
        })
 
    console.log("Fin de ejercicio 12");
}

function ejercicio13(){

    console.log("Inicio de ejercicio 13");

    function objectToArray(obj){
        return Object.entries(obj);
    }

    let cantidad = parseInt(prompt("¿Cuantos datos quieres ingresar?"));
    for (let i = 0; i < cantidad; i++){
        let clave = prompt("Ingresa la clave:");
        let valor = prompt("Ingresa el valor:");

        obj[clave] = isNaN(valor) ? valor : Number(valor);
    }
    let resultado = objectToArray(obj);

    Swal.fire({
          title: "Respuesta",
          text: "Resultado: " + JSON.stringify(resultado),
          icon: "success"
        })

    console.log("Fin de ejercicio 13");

}

function ejercicio14(){

    console.log("Inicio de ejercicio 14");

    function squareSum(n){
        let suma = 0;

        for(let i = 1; i <= n; i++){
            suma += num ** 2;
            
        }
        return suma;
    }   
    let n = parseInt(prompt("Ingresa un numero: "));
    let resultado = squareSum(n);

    Swal.fire({
          title: "Respuesta",
          text: "La suma de los cuadrados de cada numero es: " + resultado,
          icon: "success"
    })
    console.log("Fin de ejercicio 14");
}

function ejercicio15(){

    console.log("Inicio de ejercicio 15");

    function multiplyByLength(arr) {
      let longitud = arr.length;

      return arr.map(function(num) {
         return num * longitud;
        });
    }
    let cantidad = parseInt(prompt("¿Cuántos números quieres ingresar?"));

    let numeros = [];

   for (let i = 0; i < cantidad; i++) {
        let numero = parseFloat(prompt("Ingresa el número " + (i + 1) + ":"));
        numeros.push(numero);
    }

    let resultado = multiplyByLength(numeros);
    Swal.fire({
          title: "Respuesta",
          text: "Resultado: " + resultado,
          icon: "success"
    })
    console.log("Fin de ejercicio 15");
}

function ejercicio16(){

    console.log("Inicio de ejercicio 16");

    function countdown(n) {
    let resultado = [];

    for (let i = n; i >= 0; i--) {
        resultado.push(i);
    }
    return resultado;
}
   let numero = parseInt(prompt("Ingresa un número:"));
   let resultado = countdown(numero);
    Swal.fire({
          title: "Respuesta",
          text: "Cuenta regresiva: " + resultado,
          icon: "success"
    })

    console.log("Fin de ejercicio 16");
}

function ejercicio17(){

    console.log("Inicio de ejercicio 17");
    
    function diffMaxMin(arr) {
        let max = Math.max(...arr);
        let min = Math.min(...arr);

      return max - min;
    }
    let cantidad = parseInt(prompt("¿Cuántos números quieres ingresar?"));
    let numeros = [];
    
    for (let i = 0; i < cantidad; i++) {
        let numero = parseFloat(prompt("Ingresa el número " + (i + 1) + ":"));
        numeros.push(numero);
    }
    let resultado = diffMaxMin(numeros);

    Swal.fire({
          title: "Respuesta",
          text: "La diferencia entre mayor y menor es: " + resultado,
          icon: "success"
    })
    console.log("Fin de ejercicio 17");
}

function ejercicio18(){

    console.log("Inicio de ejercicio 18");

    function filterList(arr) {
    return arr.filter(function(elemento) {
        return Number.isInteger(elemento);
    });
}

let cantidad = parseInt(prompt("¿Cuántos elementos quieres ingresar?"));

let datos = [];

for (let i = 0; i < cantidad; i++) {
    let entrada = prompt("Ingresa el elemento " + (i + 1) + ":");

    let numero = Number(entrada);

    if (!isNaN(numero) && Number.isInteger(numero)) {
        datos.push(numero);
    } else {
        datos.push(entrada); 
    }
}
    let resultado = filterList(datos);
    Swal.fire({
          title: "Respuesta",
          text: "los numeros esteros son: " + resultado,
          icon: "success"
    })

    console.log("Fin de ejercicio 18");
}

