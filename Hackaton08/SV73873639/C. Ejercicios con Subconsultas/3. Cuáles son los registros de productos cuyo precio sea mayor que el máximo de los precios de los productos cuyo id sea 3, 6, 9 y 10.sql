--Ejercicio 03--
--3. ¿Cuáles son los registros de productos cuyo precio sea mayor que el máximo de los precios de los productos cuyo id sea 3, 6, 9 y 10?--

SELECT * FROM products 
WHERE unit_price > (SELECT MAX(unit_price) FROM products WHERE product_id IN (3, 6, 9, 10));