--Ejercicio 04--
--¿Cuáles son las ciudades desde las que hay más de 7 pedidos?--

SELECT c.city, COUNT(o.order_id) AS numero_pedidos
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.city 
HAVING COUNT(o.order_id) > 7;