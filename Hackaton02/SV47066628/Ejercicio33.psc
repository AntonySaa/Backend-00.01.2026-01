Proceso continuar_proceso
	
    Definir continuar Como Caracter
    
    Repetir
        Escribir "Presiona cualquier tecla para continuar o escribe N para salir"
        Leer continuar
        continuar = Mayusculas(continuar)
    Hasta Que continuar = "N"
    
    Escribir "¡Programa terminado!"
	
FinProceso
