--Ejercicio 10--
--Países que tengan más de 5 clientes, ordenados por nombre--

SELECT country, COUNT(*) AS total_clientes
FROM customers 
GROUP BY country 
HAVING COUNT(*) > 5 
ORDER BY country;