--Ejercicio 08--
--Informe: «El empleado N nació el N»--

SELECT 'El empleado ' || first_name || ' ' || last_name || ' nació el ' || birth_date AS informe 
FROM employees;