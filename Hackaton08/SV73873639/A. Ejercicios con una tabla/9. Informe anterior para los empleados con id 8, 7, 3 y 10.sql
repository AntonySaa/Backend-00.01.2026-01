--Ejercicio 09--
--9. Informe anterior para los empleados con id 8, 7, 3 y 10--

SELECT 'El empleado ' || first_name || ' ' || last_name || ' nació el ' || birth_date AS informe 
FROM employees 
WHERE employee_id IN (8, 7, 3, 10);

--Nota: El ID 10 no existe en la tabla,
--así que simplemente no aparece en el resultado.
