--Ejercicio 06--
--Cuántos clientes hay en cada ciudad--

SELECT city, COUNT(*) AS cantidad_clientes
FROM customers 
GROUP BY city 
ORDER BY cantidad_clientes DESC;