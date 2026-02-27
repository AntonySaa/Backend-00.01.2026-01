Proceso ciudad_mas_habitantes
	
    Definir nomCiudad Como Caracter
    Definir poblaciones Como Entero
    
    Dimension nomCiudad[11]
    Dimension poblaciones[11]
    
    Definir i Como Entero
    Definir maxPoblacion Como Entero
    Definir ciudadMax Como Caracter
	
	
    Para i = 1 Hasta 10 Con Paso 1 Hacer
        Escribir "Ciudad número ", i, ": "
        Leer nomCiudad[i]
        
        Escribir "Población de ", nomCiudad[i], ": "
        Leer poblaciones[i]
    FinPara
    
    maxPoblacion = poblaciones[1]
    ciudadMax = nomCiudad[1]
    
    Para i = 2 Hasta 10 Con Paso 1 Hacer
        Si poblaciones[i] > maxPoblacion Entonces
            maxPoblacion = poblaciones[i]
            ciudadMax = nomCiudad[i]
        FinSi
    FinPara
    
	
    Escribir "La ciudad con mas población es: ", ciudadMax
    Escribir "Población: ", maxPoblacion, " habitantes"
	
FinProceso
