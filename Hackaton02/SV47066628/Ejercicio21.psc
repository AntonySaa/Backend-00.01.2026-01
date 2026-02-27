Proceso calculo_factorial
		Definir n Como Entero
		
		Escribir "Ingrese un numero entero positivo:"
		Leer n
		
		Si n < 0 Entonces
			Escribir "No existe factorial para numeros negativos"
		Sino
			factorial = 1
			
			Si n <> 0 Entonces
				Para i = 1 Hasta n Hacer
					factorial = factorial * i
				FinPara
			FinSi
			
			Escribir "El factorial de ", n, " es: ", factorial
		FinSi
FinProceso

