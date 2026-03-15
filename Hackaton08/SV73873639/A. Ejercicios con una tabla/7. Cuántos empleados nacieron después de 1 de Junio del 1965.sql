--Ejercicio 07--
--Cuántos empleados nacieron después de 1 de Junio del 1965--

SELECT COUNT(*) AS empleados_jovenes
FROM employees 
WHERE birth_date > '1965-06-01';