--Ejercicio 02--
--2. Dime el nombre completo de los clientes--
--con los pedidos 10360, 10253 y 10440--

SELECT DISTINCT c.company_name, c.contact_name 
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IN (10360, 10253, 10440);