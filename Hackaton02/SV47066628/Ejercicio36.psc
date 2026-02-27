Proceso serie_fibonacci
	
    Definir n, i Como Entero
    Definir a, b, siguiente Como Entero
    
    Escribir "Ingrese cuántos términos de Fibonacci quiere ver: "
    Leer n
    
    a = 0
    b = 1
    
    Escribir "Serie: "
    
    Para i = 1 Hasta n Con Paso 1 Hacer
        Escribir Sin Saltar a, " "
        siguiente = a + b
        a = b
        b = siguiente
    FinPara
    
    Escribir ""
	
FinProceso
