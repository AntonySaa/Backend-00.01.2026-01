function ejercicio1() {
  console.log("Inicio del ejercicio 1");
  let strnota = prompt("Ingresa tu nota");

  let nota = Number.parseInt(strnota);

  if (Number.isNaN(nota)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (nota > 99 && nota < 1000) {
      Swal.fire({
        title: "Respuesta",
        text: "Si tiene 3 digitos",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: "No tiene 3 digitos",
        icon: "error",
      });
    }
  }
  console.log(typeof nota);
  console.log(nota);

  console.log("Fin del ejercicio 1");
}

function ejercicio2() {
  console.log("Inicio del ejercicio 2");
  let strnota = prompt("Ingresa un nota");

  let nota = Number.parseInt(strnota);

  if (Number.isNaN(nota)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (nota >= 0) {
      Swal.fire({
        title: "Respuesta",
        text: "No es un nota negativo",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: "Si es un nota negativo",
        icon: "success",
      });
    }
  }
  console.log(typeof nota);
  console.log(nota);

  console.log("Fin del ejercicio 2");
}

function ejercicio3() {
  console.log("Inicio del ejercicio 3");
  let strnota = prompt("Ingresa un nota");

  let nota = Number.parseInt(strnota);

  if (Number.isNaN(nota)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (nota % 10 === 4) {
      Swal.fire({
        title: "Respuesta",
        text: "Este nota si termina en 4",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: "Este nota no termina en 4",
        icon: "error",
      });
    }
  }
  console.log(typeof nota);
  console.log(nota);

  console.log("Fin del ejercicio 3");
}

function ejercicio4() {
  console.log("Inicio del ejercicio 4");
  let strnota1 = prompt("Ingresa un primer nota");
  let strnota2 = prompt("Ingresa un segundo nota");
  let strnota3 = prompt("Ingresa un tercer nota");

  let nota1 = Number.parseInt(strnota1);
  let nota2 = Number.parseInt(strnota2);
  let nota3 = Number.parseInt(strnota3);

  if (Number.isNaN(nota1) || Number.isNaN(nota2) || Number.isNaN(nota3)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (nota1 < nota2) {
      if (nota2 < nota3) {
        Swal.fire({
          title: "Respuesta",
          text: `El orden es: ${nota1} - ${nota2} - ${nota3}`,
        });
      } else {
        if (nota1 < nota3) {
          Swal.fire({
            title: "Respuesta",
            text: `El orden es: ${nota1} - ${nota3} - ${nota2}`,
          });
        } else {
          Swal.fire({
            title: "Respuesta",
            text: `El orden es: ${nota3} - ${nota1} - ${nota2}`,
          });
        }
      }
    } else {
      if (nota1 < nota3) {
        Swal.fire({
          title: "Respuesta",
          text: `El orden es: ${nota2} - ${nota1} - ${nota3}`,
        });
      } else {
        if (nota2 < nota3) {
          Swal.fire({
            title: "Respuesta",
            text: `El orden es: ${nota2} - ${nota3} - ${nota1}`,
          });
        } else {
          Swal.fire({
            title: "Respuesta",
            text: `El orden es: ${nota3} - ${nota2} - ${nota1}`,
          });
        }
      }
    }
  }
  console.log(typeof nota);
  console.log(nota);

  console.log("Fin del ejercicio 4");
}

function ejercicio5() {
  console.log("Inicio del ejercicio 5");
  let strZapatos = prompt("Ingresa el nota de zapatos a comprar");

  let numZapatos = Number.parseInt(strZapatos);
  let precioZapatos = numZapatos * 20;
  let pago = precioZapatos;

  if (Number.isNaN(numZapatos)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (numZapatos > 30) {
      pago = precioZapatos - precioZapatos * 0.4;
    } else {
      if (numZapatos > 20) {
        pago = precioZapatos - precioZapatos * 0.2;
      } else {
        if (numZapatos > 10) {
          pago = precioZapatos - precioZapatos * 0.1;
        }
      }
    }
  }

  Swal.fire({
    title: "Respuesta",
    text: `Usted debe pagar: $ ${pago}`,
  });

  console.log(typeof pago);
  console.log(pago);

  console.log("Fin del ejercicio 5");
}

function ejercicio6() {
  console.log("Inicio del ejercicio 6");
  let strHrsTrabajo = prompt("Ingresa tu nota de horas trabajadas");

  let numHrsTrabajo = Number.parseInt(strHrsTrabajo);
  let hrsExtras = numHrsTrabajo - 40;
  let pago = "";

  if (Number.isNaN(numHrsTrabajo)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (numHrsTrabajo < 41) {
      pago = numHrsTrabajo * 20;
    } else {
      pago = 40 * 20 + hrsExtras * 25;
    }
  }

  Swal.fire({
    title: "Respuesta",
    text: `A usted se le pagara: $ ${pago}`,
  });

  console.log(typeof pago);
  console.log(pago);

  console.log("Fin del ejercicio 6");
}

function ejercicio7() {
  console.log("Inicio del ejercicio 7");
  let strMembresia = prompt("Ingresa el tipo de Membresia: A, B o C");

  if (strMembresia === "A" || strMembresia === "a") {
    Swal.fire({
      title: "Respuesta",
      text: "Tu descuento es de: 10%",
      icon: "success",
    });
  } else {
    if (strMembresia === "B" || strMembresia === "b") {
      Swal.fire({
        title: "Respuesta",
        text: "Tu descuento es de: 15%",
        icon: "success",
      });
    } else {
      if (strMembresia === "C" || strMembresia === "c") {
        Swal.fire({
          title: "Respuesta",
          text: "Tu descuento es de: 20%",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: "Ingresa una opción correcta",
          icon: "error",
        });
      }
    }
  }

  console.log(typeof strMembresia);
  console.log(strMembresia);

  console.log("Fin del ejercicio 7");
}

function ejercicio8() {
  console.log("Inicio del ejercicio 8");
  let strNota1 = prompt("Ingresa La primera nota:");
  let strNota2 = prompt("Ingresa la segunda nota:");
  let strNota3 = prompt("Ingresa la tercera nota:");

  let nota1 = Number.parseInt(strNota1);
  let nota2 = Number.parseInt(strNota2);
  let nota3 = Number.parseInt(strNota3);

  let promedio = (nota1 + nota2 + nota3) / 3;

  // Estoy considerando que se aprueba con notas mayor a 12

  if (Number.isNaN(nota1) || Number.isNaN(nota2) || Number.isNaN(nota3)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (promedio > 12) {
      Swal.fire({
        title: "Respuesta",
        text: "Estudiante Aprueba",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: "Estudiante Desaprueba",
        icon: "error",
      });
    }
  }

  console.log(typeof nota1);
  console.log(typeof nota2);
  console.log(typeof nota3);
  console.log(nota1);
  console.log(nota2);
  console.log(nota3);

  console.log("Fin del ejercicio 8");
}

function ejercicio9() {
  console.log("Inicio del ejercicio 9");
  let strSueldo = prompt("Ingrese el sueldo actual del trabajador:");

  let numSueldo = Number.parseInt(strSueldo);

  if (Number.isNaN(numSueldo)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (numSueldo > 2000) {
      Swal.fire({
        title: "Respuesta",
        text: "El aumento sera del 5%",
        icon: "success",
      });
    } else {
      if (numSueldo < 2000) {
        Swal.fire({
          title: "Respuesta",
          text: "El aumento sera del 10%",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: "No percibe aumento",
          icon: "error",
        });
      }
    }
  }
  console.log(typeof numSueldo);
  console.log(numSueldo);

  console.log("Fin del ejercicio 9");
}

function ejercicio10() {
  console.log("Inicio del ejercicio 10");
  let strSueldo = prompt("Ingrese el sueldo actual del trabajador:");

  let numSueldo = Number.parseInt(strSueldo);

  if (Number.isNaN(numSueldo)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (numSueldo > 2000) {
      Swal.fire({
        title: "Respuesta",
        text: "El aumento sera del 5%",
        icon: "success",
      });
    } else {
      if (numSueldo < 2000) {
        Swal.fire({
          title: "Respuesta",
          text: "El aumento sera del 10%",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: "No percibe aumento",
          icon: "error",
        });
      }
    }
  }
  console.log(typeof numSueldo);
  console.log(numSueldo);

  console.log("Fin del ejercicio 10");
}

function ejercicio11() {
  console.log("Inicio del ejercicio 11");
  let strNum1 = prompt("Ingresa el primer numero:");
  let strNum2 = prompt("Ingresa el segundo numero:");
  let strNum3 = prompt("Ingresa el tercer numero:");

  let num1 = Number.parseInt(strNum1);
  let num2 = Number.parseInt(strNum2);
  let num3 = Number.parseInt(strNum3);

  if (Number.isNaN(num1) || Number.isNaN(num2) || Number.isNaN(num3)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (num1 > num2) {
      if (num1 > num3) {
        Swal.fire({
          title: "Respuesta",
          text: `El numero mayor es: ${num1}`,
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: `El numero mayor es: ${num3}`,
        });
      }
    } else {
      if (num2 > num3) {
        Swal.fire({
          title: "Respuesta",
          text: `El numero mayor es: ${num2}`,
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: `El numero mayor es: ${num3}`,
        });
      }
    }
  }

  console.log(typeof num1);
  console.log(typeof num2);
  console.log(typeof num3);
  console.log(num1);
  console.log(num2);
  console.log(num3);

  console.log("Fin del ejercicio 11");
}

function ejercicio12() {
  console.log("Inicio del ejercicio 12");
  let strNum1 = prompt("Ingresa el primer numero:");
  let strNum2 = prompt("Ingresa el segundo numero:");

  let num1 = Number.parseInt(strNum1);
  let num2 = Number.parseInt(strNum2);

  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (num1 > num2) {
      Swal.fire({
        title: "Respuesta",
        text: `El numero mayor es: ${num1}`,
      });
    } else {
      if (num2 > num1) {
        Swal.fire({
          title: "Respuesta",
          text: `El numero mayor es: ${num2}`,
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: `Ambos numeros son iguales`,
        });
      }
    }
  }

  console.log(typeof num1);
  console.log(typeof num2);
  console.log(num1);
  console.log(num2);

  console.log("Fin del ejercicio 12");
}

function ejercicio13() {
  console.log("Inicio del ejercicio 13");
  let strLetra = prompt("Ingresa una Vocal:");

  let vocal = strLetra.toUpperCase();

  if (
    vocal === "A" ||
    vocal === "E" ||
    vocal === "I" ||
    vocal === "O" ||
    vocal === "U"
  ) {
    Swal.fire({
      title: "Respuesta",
      text: `Es una vocal`,
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Respuesta",
      text: `No es una vocal`,
      icon: "error",
    });
  }

  console.log(typeof vocal);
  console.log(vocal);

  console.log("Fin del ejercicio 13");
}

function ejercicio14() {
  console.log("Inicio del ejercicio 14");
  let strNum = prompt("Ingresa un numero del 1 al 10:");

  let num = Number.parseInt(strNum);

  if (num === 1 || num === 2 || num === 3 || num === 5 || num === 7) {
    Swal.fire({
      title: "Respuesta",
      text: `Es un numero primo`,
      icon: "success",
    });
  } else {
    if (num === 4 || num === 6 || num === 8 || num === 9 || num === 10) {
      Swal.fire({
        title: "Respuesta",
        text: `No es un numero primo`,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `No ingreso un numero del 1 al 10`,
        icon: "error",
      });
    }
  }

  console.log(typeof num);
  console.log(num);

  console.log("Fin del ejercicio 14");
}

function ejercicio15() {
  console.log("Inicio del ejercicio 15");
  let strCm = prompt(
    "Ingrese una longitud en centimetros (Solo digite numeros):",
  );
  let strLb = prompt("Ingrese un peso en libras (Solo digite numeros)");

  let cm = Number.parseInt(strCm);
  let lb = Number.parseInt(strLb);

  pulgadas = cm / 2.54;
  kilogramos = lb / 2.205;

  if (Number.isNaN(cm) || Number.isNaN(lb)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Respuesta",
      text: `${cm} centimetros son ${pulgadas} pulgadas. y 
      ${lb} libras son ${kilogramos} kilogramos.`,
      icon: "success",
    });
  }

  console.log(typeof cm);
  console.log(typeof lb);
  console.log(cm);
  console.log(lb);

  console.log("Fin del ejercicio 15");
}

function ejercicio16() {
  console.log("Inicio del ejercicio 16");
  let strNum = prompt("Ingrese un numero del 1 a 7");

  let num = Number.parseInt(strNum);

  if (Number.isNaN(num)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar notas no palabras",
      icon: "error",
    });
  } else {
    if (num === 1) {
      Swal.fire({
        title: "Respuesta",
        text: "El dia es Lunes",
        icon: "success",
      });
    } else {
      if (num === 2) {
        Swal.fire({
          title: "Respuesta",
          text: "El dia es Martes",
          icon: "success",
        });
      } else {
        if (num === 3) {
          Swal.fire({
            title: "Respuesta",
            text: "El dia es Miercoles",
            icon: "success",
          });
        } else {
          if (num === 4) {
            Swal.fire({
              title: "Respuesta",
              text: "El dia es Jueves",
              icon: "success",
            });
          } else {
            if (num === 5) {
              Swal.fire({
                title: "Respuesta",
                text: "El dia es Viernes",
                icon: "success",
              });
            } else {
              if (num === 6) {
                Swal.fire({
                  title: "Respuesta",
                  text: "El dia es Sabado",
                  icon: "success",
                });
              } else {
                if (num === 7) {
                  Swal.fire({
                    title: "Respuesta",
                    text: "El dia es Domingo",
                    icon: "success",
                  });
                } else {
                  Swal.fire({
                    title: "Respuesta",
                    text: "No es un numero del 1 al 7",
                    icon: "error",
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(typeof num);
  console.log(num);

  console.log("Fin del ejercicio 16");
}

function ejercicio17() {
  console.log("Inicio del ejercicio 17");
  let strHr = prompt("Ingresa las Horas:");
  let strMin = prompt("Ingresa los Minutos:");
  let strSeg = prompt("Ingresa los Segundos:");

  let hr = Number.parseInt(strHr);
  let min = Number.parseInt(strMin);
  let seg = Number.parseInt(strSeg);

  seg = seg + 1;

  if (Number.isNaN(hr) || Number.isNaN(min) || Number.isNaN(seg)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (seg === 60) {
      seg = 0;
      min = min + 1;
    }
    if (min === 60) {
      min = 0;
      hr = hr + 1;
    }
    if (hr === 24) {
      hr = 0;
    }
  }

  Swal.fire({
    title: "Respuesta",
    text: `La Hora exacta en 1 segundo es: ${hr}:${min}:${seg}`,
    icon: "success",
  });

  console.log(typeof hr);
  console.log(typeof min);
  console.log(typeof seg);
  console.log(hr);
  console.log(min);
  console.log(seg);

  console.log("Fin del ejercicio 17");
}

function ejercicio18() {
  console.log("Inicio de ejercicio 18");
  let numCd = Number.parseInt(prompt("Ingrese el numero de CD a comprar:"));

  let precio;
  let ganaciaVD;

  if (Number.isNaN(numCd)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (numCd >= 500) {
      precio = numCd * 6;
      ganaciaVD = precio * 0.0825;
    } else {
      if (numCd > 99) {
        precio = numCd * 7;
        ganaciaVD = precio * 0.0825;
      } else {
        if (numCd > 9) {
          precio = numCd * 8;
          ganaciaVD = precio * 0.0825;
        } else {
          precio = numCd * 10;
          ganaciaVD = precio * 0.0825;
        }
      }
    }
    Swal.fire({
      title: "Respuesta",
      text: `El precio total para el cliente es: $${precio} y la ganancia para el vendedor es: $${ganaciaVD}`,
      icon: "success",
    });
  }

  console.log(typeof numCd);
  console.log(numCd);

  console.log("Fin del ejercicio 18");
}

function ejercicio19() {
  console.log("Inicio de ejercicio 19");
  let numId = Number.parseInt(prompt("Ingrese el numero identificador:"));
  let diasTrab = Number.parseInt(
    prompt("Ingrese el numero de dias trabajados:"),
  );

  let pago;

  /* Asumiendo que los numeros identificadores son:

  1 para cajero
  2 para Servidor
  3 para preparador
  4 para mantenimiento */

  if (Number.isNaN(numId) || Number.isNaN(diasTrab)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (numId === 1) {
      pago = diasTrab * 56;
    } else {
      if (numId === 2) {
        pago = diasTrab * 64;
      } else {
        if (numId === 3) {
          pago = diasTrab * 80;
        } else {
          if (numId === 4) {
            pago = diasTrab * 48;
          }
        }
      }
    }
    Swal.fire({
      title: "Respuesta",
      text: `El monto total a pagar al trabajador es: $${pago}`,
      icon: "success",
    });
  }

  console.log(typeof numId);
  console.log(typeof diasTrab);
  console.log(numId);
  console.log(diasTrab);

  console.log("Fin del ejercicio 19");
}

function ejercicio20() {
  console.log("Inicio de ejercicio 20");

  // Leer los 4 números
  const num1 = Number(prompt("Ingrese el primer número:"));
  const num2 = Number(prompt("Ingrese el segundo número:"));
  const num3 = Number(prompt("Ingrese el tercer número:"));
  const num4 = Number(prompt("Ingrese el cuarto número:"));

  if (
    isNaN(num1) ||
    isNaN(num2) ||
    isNaN(num3) ||
    isNaN(num4) ||
    num1 < 0 ||
    num2 < 0 ||
    num3 < 0 ||
    num4 < 0
  ) {
    Swal.fire({
      title: "Error",
      text: "Debes ingresar cuatro números enteros positivos",
      icon: "error",
    });
    console.log("Fin del ejercicio 20 (entrada inválida)");
    return;
  }

  let mensajes = [];

  // Cantidad de pares
  let cantPares = 0;
  if (num1 % 2 === 0) cantPares++;
  if (num2 % 2 === 0) cantPares++;
  if (num3 % 2 === 0) cantPares++;
  if (num4 % 2 === 0) cantPares++;

  mensajes.push(`Cantidad de números pares: ${cantPares}`);

  // Número mayor
  const mayor = Math.max(num1, num2, num3, num4);
  mensajes.push(`El número mayor es: ${mayor}`);

  // Si el tercero es par
  if (num3 % 2 === 0) {
    const cuadrado = num2 * num2;
    mensajes.push(`${num2} al cuadrado es: ${cuadrado}`);
  }

  // Si el primero es menor al cuarto
  if (num1 < num4) {
    const media = (num1 + num2 + num3 + num4) / 4;
    mensajes.push(`La Media de los cuatro numeros es: ${media.toFixed(2)}`);
  }

  // Si el segundo es mayor al tercero Y tercero está entre 50 y 700
  if (num2 > num3 && num3 >= 50 && num3 <= 700) {
    const suma = num1 + num2 + num3 + num4;
    mensajes.push(`La Suma de los cuatro numeros es: ${suma}`);
  }

  Swal.fire({
    title: "Resultado",
    html: mensajes.join("<br><br>"),
    icon: "info",
    confirmButtonText: "Aceptar",
    width: 500,
  });

  console.log("Valores ingresados:", { num1, num2, num3, num4 });
  console.log("Fin del ejercicio 20");
}

function ejercicio21() {
  console.log("Inicio de ejercicio 21");
  const num = Number(prompt("Ingresa un numero entero positivo"));

  if (isNaN(num) || !Number.isInteger(num)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero válido",
      icon: "error",
    });
    return;
  }

  if (num < 0) {
    Swal.fire({
      title: "Error",
      text: "No existe factorial para números negativos",
      icon: "error",
    });
    return;
  }

  let resultado = 1;
  for (let i = 2; i <= num; i++) {
    resultado *= i;
  }

  Swal.fire({
    title: "respuesta",
    text: `El factorial de ${num} es ${resultado}`,
    icon: "success",
  });
  console.log("Fin de ejercicio 21");
}

function ejercicio22() {
  console.log("Inicio de ejercicio 22");
  const num = Number(prompt("Ingresa un numero entero positivo"));

  if (isNaN(num) || !Number.isInteger(num)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero válido",
      icon: "error",
    });
    return;
  }

  if (num < 0) {
    Swal.fire({
      title: "Error",
      text: "Debe ingresar un numero entero positivo",
      icon: "error",
    });
    return;
  }

  let suma = 0;
  for (let i = 1; i <= num; i++) {
    suma += i;
  }

  Swal.fire({
    title: "respuesta",
    text: `La suma de los ${num} primeros numeros es: ${suma}`,
    icon: "success",
  });
  console.log("Fin de ejercicio 22");
}

function ejercicio23() {
  console.log("Inicio de ejercicio 23");
  const num = Number(prompt("Ingresa un numero entero positivo"));

  if (isNaN(num) || !Number.isInteger(num)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero válido",
      icon: "error",
    });
    return;
  }

  if (num < 0) {
    Swal.fire({
      title: "Error",
      text: "Debe ingresar un numero entero positivo",
      icon: "error",
    });
    return;
  }

  let suma = 0;
  for (let i = 1; i <= num; i++) {
    if (i % 2 != 0) {
      suma += i;
    }
  }

  Swal.fire({
    title: "respuesta",
    text: `La suma de los ${num} primeros numeros impares es: ${suma}`,
    icon: "success",
  });
  console.log("Fin de ejercicio 23");
}

function ejercicio24() {
  console.log("Inicio de ejercicio 24");

  let suma = 0;
  for (let i = 1; i <= 1000; i++) {
    if (i % 2 === 0) {
      suma += i;
    }
  }

  Swal.fire({
    title: "respuesta",
    text: `La suma de los numero pares hasta 1000 es: ${suma}`,
    icon: "success",
  });
  console.log("Fin de ejercicio 24");
}

function ejercicio25() {
  console.log("Inicio de ejercicio 25");
  const num = Number(prompt("Ingresa un numero entero positivo"));

  if (isNaN(num) || !Number.isInteger(num)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero válido",
      icon: "error",
    });
    return;
  }

  if (num < 0) {
    Swal.fire({
      title: "Error",
      text: "No existe factorial para números negativos",
      icon: "error",
    });
    return;
  }

  let resultado = 1;
  let i = 2;

  while (i <= num) {
    resultado *= i;
    i++;
  }

  Swal.fire({
    title: "respuesta",
    text: `El factorial de ${num} es ${resultado}`,
    icon: "success",
  });
  console.log("Fin de ejercicio 25");
}

function ejercicio26() {
  console.log("Inicio de ejercicio 26");
  const dividendo = Number(prompt("Ingresa el dividendo"));
  const divisor = Number(prompt("Ingresa el divisor"));

  if (isNaN(dividendo) || isNaN(divisor)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número válido",
      icon: "error",
    });
    return;
  }

  if (divisor <= 0) {
    Swal.fire({
      title: "respuesta",
      text: `El divisor debe ser mayor que 0`,
      icon: "warning",
    });
  } else {
    let cociente = 0;
    let resto = dividendo;

    while (resto >= divisor) {
      resto -= divisor;
      cociente += 1;
    }

    Swal.fire({
      title: "Resultado",
      html: `Cociente: <b>${cociente}</b><br>` + `Resto: <b>${resto}</b>`,
      icon: "success",
    });

    console.log(typeof dividendo);
    console.log(typeof divisor);
    console.log(dividendo);
    console.log(divisor);
    console.log("Fin de ejercicio 26");
  }
}

function ejercicio27() {
  console.log("Inicio de ejercicio27");

  let suma = 0;
  let contador = 0;
  let numero;

  do {
    numero = Number(
      prompt("Ingresa Numero positivo (Negativo para terminar):"),
    );
    console.log(numero);

    if (isNaN(numero)) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa un numero valido",
        icon: "error",
      });
    }

    if (numero < 0) {
      break;
    }

    if (numero > 0) {
      suma += numero;
      contador++;
    }
  } while (true);

  if (contador === 0) {
    Swal.fire({
      title: "Sin datos",
      text: "No ingresaste ningun numero positivo",
      icon: "info",
    });
  } else {
    const media = suma / contador;
    Swal.fire({
      title: "Media calculada",
      html: `Media = ${media.toFixed(2)}<br>(Numeros validos: ${contador})`,
      icon: "success",
    });
  }

  console.log("Fin del ejercicio27");
}

function ejercicio28() {
  console.log("Inicio de ejercicio28");

  let i = 1;
  let suma = 0;

  do {
    suma += i;
    i++;
  } while (i <= 100);

  Swal.fire({
    title: "Resultado",
    text: `La suma de los primeros 100 numeros es: ${suma}`,
    icon: "success",
  });

  console.log("Fin del ejercicio28");
}

function ejercicio29() {
  console.log("Inicio de ejercicio29");

  let i = 1;
  let suma = 0;

  while (i <= 100) {
    suma += i;
    i++;
  }

  Swal.fire({
    title: "Resultado",
    text: `La suma de los primeros 100 numeros es: ${suma}`,
    icon: "success",
  });

  console.log("Fin del ejercicio29");
}

function ejercicio30() {
  console.log("Inicio de ejercicio30");

  let suma = 0;

  for (i = 1; i <= 100; i++) {
    suma += i;
  }

  Swal.fire({
    title: "Resultado",
    text: `La suma de los primeros 100 numeros es: ${suma}`,
    icon: "success",
  });

  console.log("Fin del ejercicio30");
}

function ejercicio31() {
  console.log("Inicio de ejercicio31");

  let sumPares = 0;
  let sumImpares = 0;
  let contPares = 0;
  let contImpares = 0;

  for (i = 1; i <= 10; i++) {
    const num = Number(prompt(`Ingrese su ${i} numero:`));
    if (num % 2 === 0) {
      sumPares += num;
      contPares++;
    } else {
      sumImpares += num;
      contImpares++;
    }
  }

  let mensajes = [];

  if (contPares > 0) {
    const mediaPares = sumPares / contPares;
    mensajes.push(
      `Media de los números pares: <b>${mediaPares.toFixed(2)}</b> (${contPares} números)`,
    );
  } else {
    mensajes.push("No se ingresaron números pares");
  }

  if (contImpares > 0) {
    const mediaImpares = sumImpares / contImpares;
    mensajes.push(
      `Media de los números impares: <b>${mediaImpares.toFixed(2)}</b> (${contImpares} números)`,
    );
  } else {
    mensajes.push("No se ingresaron números impares");
  }

  Swal.fire({
    title: "Resultados",
    html: mensajes.join("<br><br>"),
    icon: contPares === 0 && contImpares === 0 ? "warning" : "success",
    confirmButtonText: "Aceptar",
  });

  console.log("Fin del ejercicio31");
}

function ejercicio32() {
  console.log("Inicio del ejercicio32");

  let maxPoblacion = -1;
  let ciudadMayor = "";

  for (let i = 1; i <= 11; i++) {
    const nombre = prompt(`Ciudad ${i} de 11\nNombre:`);
    if (!nombre) return;

    const poblacion = Number(prompt(`Población de ${nombre}:`));
    if (isNaN(poblacion) || poblacion < 0) {
      alert("Número inválido, intenta de nuevo");
      i--;
      continue;
    }

    if (poblacion > maxPoblacion) {
      maxPoblacion = poblacion;
      ciudadMayor = nombre;
    }
  }

  Swal.fire({
    title: "Resultado",
    text: `La ciudad con más población es: ${ciudadMayor}\n(${maxPoblacion} habitantes)`,
    icon: "success",
  });

  console.log("Fin del ejercicio32");
}

function ejercicio33() {
  console.log("Inicio del ejercicio33");
  let continuar;

  do {
    continuar = prompt(
      "Presiona cualquier tecla para continuar o escribe N para salir",
    );

    if (continuar === null) {
      continuar = "N";
    }

    continuar = (continuar || "").toUpperCase();
  } while (continuar !== "N");

  Swal.fire({ title: "¡Programa terminado!", icon: "success" });

  console.log("Fin del ejercicio33");
}

function ejercicio34() {
  console.log("Inicio del ejercicio34");

  let salida = "<h3>Tablas de multiplicar del 1 al 9</h3>";

  for (let i = 1; i <= 9; i++) {
    salida += `<h4>Tabla del ${i}</h4>`;
    salida += "<pre>";

    for (let j = 1; j <= 10; j++) {
      salida += `${i} x ${j} = ${i * j}\n`;
    }

    salida += "</pre><br>";
  }

  Swal.fire({
    title: "Tablas de multiplicar",
    html: salida,
    width: 600,
    confirmButtonText: "Cerrar",
    customClass: {
      popup: "tablas-multiplicar-popup",
    },
  });

  console.log("Fin del ejercicio34");
}

function ejercicio35() {
  console.log("Inicio del ejercicio35");

  let mayor = -999999;
  let menor = 999999;

  for (let i = 1; i <= 8; i++) {
    let numero = Number(prompt("Ingresa el número " + i + " de 20:"));

    if (isNaN(numero)) {
      alert("Eso no es un número válido");
      i = i - 1;
      continue;
    }

    if (numero > mayor) {
      mayor = numero;
    }

    if (numero < menor) {
      menor = numero;
    }
  }

  Swal.fire({
    title: "Resultado",
    text:
      "El número MAYOR es: " + mayor + "\n" + "El número MENOR es: " + menor,
    icon: "success",
  });

  console.log("Fin del ejercicio35");
}

function ejercicio36() {
  console.log("Inicio del ejercicio36");
  let n = Number(prompt("¿Cuántos números de la serie de Fibonacci quieres?"));

  if (isNaN(n) || n < 1) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número mayor que 0",
      icon: "error",
    });
    return;
  }

  let a = 0;
  let b = 1;
  let serie = "0, 1";

  for (let i = 3; i <= n; i++) {
    let siguiente = a + b;
    serie += ", " + siguiente;
    a = b;
    b = siguiente;
  }

  Swal.fire({
    title: "Serie de Fibonacci",
    text: "Primeros " + n + " números: " + serie,
    icon: "success",
  });

  console.log("Fin del ejercicio36");
}

function ejercicio37() {
  console.log("Inicio de ejercicio37");
  let num1 = Number(prompt("Primer número:"));
  let num2 = Number(prompt("Segundo número:"));

  if (isNaN(num1) || isNaN(num2) || num1 === 0 || num2 === 0) {
    Swal.fire({
      title: "Error",
      text: "Ingresa dos números enteros diferentes de cero",
      icon: "error",
    });
    return;
  }

  let a = Math.abs(num1);
  let b = Math.abs(num2);

  while (b !== 0) {
    let resto = a % b;
    a = b;
    b = resto;
  }

  Swal.fire({
    title: "Resultado",
    text: `El MCD de ${num1} y ${num2} es: ${a}`,
    icon: "success",
  });

  console.log("Fin de ejercicio37");
}

function ejercicio38() {
  console.log("Inicio del ejercicio38");
  let numero = Number(
    prompt("Ingresa un número para verificar si es perfecto:"),
  );

  if (isNaN(numero) || numero <= 0) {
    Swal.fire({
      title: "Error",
      text: "Por favor ingresa un número entero positivo",
      icon: "error",
    });
    return;
  }

  let suma = 0;

  for (let i = 1; i < numero; i++) {
    if (numero % i === 0) {
      suma += i;
    }
  }

  let mensaje;

  if (suma === numero) {
    mensaje = `${numero} <b>ES</b> un número perfecto`;
  } else {
    mensaje = `${numero} <b>NO</b> es perfecto`;
  }

  Swal.fire({
    title: "Resultado",
    html: mensaje,
    icon: suma === numero ? "success" : "info",
  });
  console.log("Fin del ejercicio38");
}

function ejercicio39() {
  console.log("Inicio del ejercicio39");

  let n = Number(prompt("Cantidad de términos para aproximar PI:"));

  if (isNaN(n) || n < 1) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero mayor que 0",
      icon: "error",
    });
    return;
  }

  let suma = 0;
  let signo = 1;
  let denominador = 1;

  for (let i = 1; i <= n; i++) {
    suma += signo * (4 / denominador);
    signo *= -1;
    denominador += 2;
  }

  let diferencia = Math.abs(Math.PI - suma);

  Swal.fire({
    title: "Resultado",
    html:
      `Términos utilizados: <b>${n}</b><br><br>` +
      `Valor aproximado: <b>${suma.toFixed(10)}</b><br>` +
      `Valor real de PI: <b>${Math.PI.toFixed(10)}</b><br>`,
    icon: "info",
  });

  console.log("Fin del ejercicio39");
}

function ejercicio40() {
  console.log("Inicio del ejercicio40");

  let nTerminos = Number(prompt("Cantidad de términos para aproximar PI:"));

  if (isNaN(nTerminos) || nTerminos < 1) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero mayor que 0",
      icon: "error",
    });
    return;
  }

  let pi = 3.0;
  let signo = 1;
  let k = 2;

  for (let i = 1; i <= nTerminos; i++) {
    let termino = 4 / (k * (k + 1) * (k + 2));
    pi += signo * termino;

    signo = -signo;
    k += 2;
  }

  let diferencia = Math.abs(Math.PI - pi);

  Swal.fire({
    title: "Resultado",
    html:
      `Términos utilizados: <b>${nTerminos}</b><br><br>` +
      `Valor aproximado: <b>${pi.toFixed(10)}</b><br>` +
      `Valor real de π: <b>${Math.PI.toFixed(10)}</b><br>`,
    icon: "success",
  });

  console.log("Inicio del ejercicio40");
}
