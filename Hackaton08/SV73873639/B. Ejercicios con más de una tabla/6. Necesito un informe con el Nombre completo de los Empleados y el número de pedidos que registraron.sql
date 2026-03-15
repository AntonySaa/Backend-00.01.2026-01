--Ejercicio 06--
--Necesito un informe con el Nombre completo de los Empleados y el número de pedidos que registraron--

SELECT e.first_name || ' ' || e.last_name AS nombre_completo, COUNT(o.order_id) AS numero_pedidos
FROM employees e
JOIN orders o ON e.employee_id = o.employee_id
GROUP BY e.employee_id, e.first_name, e.last_name;
