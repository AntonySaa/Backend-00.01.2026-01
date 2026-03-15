--Ejercicio 5--
--Cuántos clientes hay que son de Londres--
SELECT COUNT(*) AS total_londres
FROM customers 
WHERE city = 'London';