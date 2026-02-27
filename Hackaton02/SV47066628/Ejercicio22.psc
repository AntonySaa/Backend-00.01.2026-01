Proceso calculo_suma
	Definir n Como Entero
	
	Escribir "Ingrese un numero entero positivo:"
	Leer n
	
	Si n < 0 Entonces
		Escribir "El numero debe ser positivo"
	Sino
		suma = 0
		
		Para i = 1 Hasta n Hacer
			suma = suma + i
		FinPara
		
		Escribir "La suma de los ", n, " primeros numeros es: ", suma
	FinSi
FinProceso

