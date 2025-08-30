## SQL notes

SQL executions:

FROM → Load the data

WHERE → Filter individual rows

GROUP BY → Group the remaining rows

HAVING → Filter groups

SELECT → Return final results


1. EXTRACT(part FROM date_value)


https://sqlguroo.com/

1. https://sqlguroo.com/question/12

```
SELECT 
  newtable.name,
  COUNT(DISTINCT  CASE WHEN orders.status = 'processed' THEN newtable.order_id END) AS processed_orders,
  COUNT(DISTINCT CASE WHEN orders.status = 'pending' THEN newtable.order_id END) AS pending_orders,
  COUNT(DISTINCT CASE WHEN orders.status = 'shipped' THEN newtable.order_id  END) AS shipped_orders,
  COUNT(DISTINCT CASE WHEN orders.status = 'cancelled' THEN newtable.order_id END) AS cancelled_orders
FROM (
SELECT 
    product_detail.product_name AS name, 
    order_details.order_id AS order_id 
  FROM product_detail 
  INNER JOIN order_details 
    ON order_details.product_id = product_detail.product_id 
  WHERE product_detail.product_name = 'Green Leaf Lettuce'
) AS newtable
LEFT JOIN orders  
  ON orders.order_id = newtable.order_id
GROUP BY newtable.name;

```
if no pivotal table was required 

```
SELECT orders.status, COUNT(*) AS count
FROM (
  SELECT order_details.order_id
  FROM product_detail
  INNER JOIN order_details
  ON order_details.product_id = product_detail.product_id
  WHERE product_detail.product_name = 'Green Leaf Lettuce'
) AS newtable
LEFT JOIN orders
ON orders.order_id = newtable.order_id
GROUP BY orders.status;
```

https://sqlguroo.com/question/13

```
select tmp.order_id

from  
(
SELECT orders.order_id as order_id, order_details.product_id as product_id
FROM orders
LEFT JOIN order_details
ON orders.order_id = order_details.order_id 
) 
  
as tmp
left join product_detail
on tmp.product_id = product_detail.product_id
GROUP BY tmp.order_id 
order by sum(product_detail.weight) DESC
LIMIT 3
```

https://sqlguroo.com/question/15

```
-- SELECT curr.year as year,  ROUND(((curr.gdp - prev.gdp) / prev.gdp) * 100, 2)  as yoy
-- from usa_gdp as curr
-- join usa_gdp as prev
-- on curr.year = prev.year + 1
-- where curr.year between 1970 and 1980

-- select year, 
--  ROUND(((gdp - LAG(gdp) OVER (ORDER BY year))/LAG(gdp) OVER (ORDER BY year))*100, 2) as yoy
-- from usa_gdp
-- where year between 1970 and 1980

SELECT year, 
  yoy_growth FROM 
  
  (SELECT *, CONCAT(ROUND(((gdp-LAG(gdp) OVER(ORDER BY year))*100)/LAG(gdp) OVER(ORDER BY year), 2), '%') 
  AS yoy_growth FROM usa_gdp ) AS XY 
  WHERE year BETWEEN 1970 AND 1980

-- SELECT * FROM usa_gdp WHERE year < 1970;

```

* LAG(column) OVER (ORDER BY ...) is a window function that lets you peek at the value from a previous row —  without doing a self-join.
* every column in the SELECT clause that’s not an aggregate (like COUNT) must be included in the GROUP BY.

```
https://sqlguroo.com/question/16
select product_name
  from
  (
  SELECT 
  oi.product_id, 
  oi.product_name, 
  EXTRACT(MONTH FROM o.order_date) AS sale_month
FROM orders AS o
LEFT JOIN (
  SELECT 
    od.order_id, 
    od.product_id, 
    pd.product_name
  FROM order_details AS od
  LEFT JOIN product_detail AS pd
    ON od.product_id = pd.product_id
) AS oi
ON oi.order_id = o.order_id
where extract(year from o.order_date) = 2021 
    ) 
 as newtab
GROUP by product_name
HAVING COUNT(DISTINCT sale_month) > 6;
```

 






