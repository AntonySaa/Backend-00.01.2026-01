--Ejercicio 10--
--Quiero saber los clientes que hayan hecho más de un pedido y que hayan sido registrados por un Empleado cuyo nombre sea Margaret.--

SELECT c.company_name, COUNT(o.order_id) AS cantidad_pedidos
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN employees e ON o.employee_id = e.employee_id
WHERE e.first_name = 'Margaret'
GROUP BY c.company_name
HAVING COUNT(o.order_id) > 1;