--Ejercicio 4--
--¿Qué clientes viven en Londres y su nombre empieza por A?--
SELECT company_name FROM customers 
WHERE city = 'London' AND company_name LIKE 'A%';

--Como el ejercicio pide el CustomerName--
--(que suele ser el nombre de la empresa en este modelo),--
--usaremos "company_name."--