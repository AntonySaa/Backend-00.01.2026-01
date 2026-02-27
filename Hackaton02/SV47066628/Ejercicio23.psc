Proceso suma_numeros_impares
	Definir n Como Entero
	
	Escribir "Ingrese un numero entero positivo:"
	Leer n
	
	Si n < 1 Entonces
		Escribir "El numero debe ser mayor o igual a 1"
	Sino
		suma = 0
		
		Para i = 1 Hasta n Hacer
			Si i MOD 2 <> 0 Entonces
				suma = suma + i
			FinSi
		FinPara
		
		Escribir "La suma de los numeros impares menores o iguales a ", n, " es: ", suma
	FinSi
FinProceso

