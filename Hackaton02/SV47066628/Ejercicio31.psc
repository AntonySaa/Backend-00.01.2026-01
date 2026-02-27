Proceso media_pares_impares
	Definir num Como Entero
	
	sumPares = 0
	sumImpares = 0
	contPares = 0
	contImpares = 0
	
	Para i = 1 Hasta 10 Hacer
		Escribir "Ingrese su numero ", i, ":"
		Leer num
		
		Si num % 2 = 0 Entonces
			sumPares = sumPares + num
			contPares = contPares + 1
		Sino
			sumImpares = sumImpares + num
			contImpares = contImpares + 1
		FinSi
	FinPara
	
	Si cont_pares > 0 Entonces
		mediaPares = sumPares / contPares
		Escribir "Media de los numeros pares: ", mediaPares
	Sino
		Escribir "No se ingresaron numeros pares"
	FinSi
	
	Si contImpares > 0 Entonces
		mediaImpares = sumImpares / contImpares
		Escribir "Media de los numeros impares: ", mediaImpares
	Sino
		Escribir "No se ingresaron numeros impares"
	FinSi
FinProceso