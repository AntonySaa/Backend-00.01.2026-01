--Sección B--
--B. B. Ejercicios con más de una tabla
--Ejercicio 01--
--1. Dime el nombre del cliente del pedido 10360--

SELECT c.company_name 
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id = 10360;