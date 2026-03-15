--Ejercicio 08--
--Quiero saber el número de pedido, qué empleado (sólo el nombre) lo registró y el cliente.--

SELECT o.order_id, e.first_name AS nombre_empleado, c.company_name AS cliente
FROM orders o
JOIN employees e ON o.employee_id = e.employee_id
JOIN customers c ON o.customer_id = c.customer_id;
