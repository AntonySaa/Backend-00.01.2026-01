--Ejercicio 05--
--5. ¿Qué clientes (Customers) tenemos registrados, que estén en ciudades de nuestros proveedores (Suppliers)?--

SELECT * FROM customers 
WHERE city IN (SELECT city FROM suppliers);