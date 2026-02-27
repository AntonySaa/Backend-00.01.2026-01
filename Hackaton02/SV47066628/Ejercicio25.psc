Proceso factorial_distinto
	Definir n Como Entero
	
	Escribir "Ingrese un numero entero positivo:"
	Leer n
	
	Si n < 0 Entonces
		Escribir "No existe factorial para numeros negativos"
	Sino
		factorial = 1
		
		Mientras n > 0 Hacer
			factorial = factorial * n
			n = n - 1
		FinMientras
		
		Escribir "El factorial es: ", factorial
	FinSi
FinProceso