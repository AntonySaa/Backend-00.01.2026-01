--Ejercicio 02--
--¿Cuál es el producto cuyo precio sea al menos 10 veces el pedido mínimo (quantity) de los pedidos (OrderDetails)?--

--Buscamos la cantidad mínima de la tabla de detalles y la multiplicamos por 10.--

SELECT product_name, unit_price 
FROM products 
WHERE unit_price >= 10 * (SELECT MIN(quantity) FROM order_details);
