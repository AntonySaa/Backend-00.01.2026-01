--Ejercicio 03--
--3. Dime las ciudades y número de pedidos de clientes en esa ciudad--

SELECT c.city, COUNT(o.order_id) AS numero_pedidos
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.city;