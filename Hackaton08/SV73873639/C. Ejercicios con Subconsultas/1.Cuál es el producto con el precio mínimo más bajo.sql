--Sección C--
--C. Ejercicios con Subconsultas--
--Ejercicio 1--
---1. ¿Cuál es el producto con el precio mínimo más bajo?--
SELECT product_name, unit_price 
FROM products 
WHERE unit_price = (SELECT MIN(unit_price) FROM products);
