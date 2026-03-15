--Ejercicio  07--
--En el informe anterior, sólo necesito los empleados cuyo nombre comience por M--

SELECT e.first_name || ' ' || e.last_name AS nombre_completo, COUNT(o.order_id) AS numero_pedidos
FROM employees e
JOIN orders o ON e.employee_id = o.employee_id
WHERE e.first_name LIKE 'M%'
GROUP BY e.employee_id, e.first_name, e.last_name;