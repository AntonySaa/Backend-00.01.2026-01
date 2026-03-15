--Ejercicio 09--
--¿Hay algún cliente que haya hecho más de un pedido registrado por el mismo empleado?--

SELECT c.company_name, e.first_name AS nombre_empleado, COUNT(o.order_id) AS cantidad_pedidos
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN employees e ON o.employee_id = e.employee_id
GROUP BY c.company_name, e.first_name
HAVING COUNT(o.order_id) > 1;