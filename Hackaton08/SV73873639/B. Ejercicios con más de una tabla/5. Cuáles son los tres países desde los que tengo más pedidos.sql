--Ejercicio 05--
--5. ¿Cuáles son los tres países desde los que tengo más pedidos?--

SELECT ship_country, COUNT(order_id) AS numero_pedidos
FROM orders
GROUP BY ship_country
ORDER BY numero_pedidos DESC
LIMIT 3;