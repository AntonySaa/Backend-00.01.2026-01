Proceso numero_mayor_menor
	
    Definir num Como Entero
    Dimension num[20]
    
    Definir i Como Entero
    Definir may, men Como Entero
    
    Escribir "Ingrese 20 números enteros:"
    
    Para i = 1 Hasta 5 Con Paso 1 Hacer
        Escribir "Número ", i, ": "
        Leer num[i]
    FinPara
    
    may = num[1]
    men = num[1]
    
    Para i = 2 Hasta 5 Con Paso 1 Hacer
        Si num[i] > may Entonces
            may = num[i]
        FinSi
        
        Si num[i] < men Entonces
            men = num[i]
        FinSi
    FinPara
    
    Escribir "El numero MAYOR es: ", may
    Escribir "El numero MENOR es: ", men

	
FinProceso
