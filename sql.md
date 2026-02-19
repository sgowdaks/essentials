## SQL notes

SQL executions:

FROM → Load the data

WHERE → Filter individual rows

GROUP BY → Group the remaining rows

HAVING → Filter groups

SELECT → Return final results

## SQL order

SELECT |
FROM |
JOIN |
WHERE |
GROUP BY |
HAVING |
ORDER BY


### Common Join Keywords

If you want to join a table to itself, you must use one of these valid keywords:

| Keyword | Use in a Self Join |
| --- | --- |
| **`INNER JOIN`** | Matches rows only where the condition (like `DATEDIFF`) is met. |
| **`JOIN`** | In most SQL dialects, this is shorthand for `INNER JOIN`. |
| **`LEFT JOIN`** | Includes all rows from `v1`, even if no matching `v2` (yesterday) exists. |
| **`CROSS JOIN`** | Pairs every single row with every other row (rarely used for this problem). |

---

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

```
SELECT customer_id
FROM (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (ORDER BY order_date DESC) AS rn
  FROM orders
  WHERE EXTRACT(YEAR FROM order_date) = 2020
    AND EXTRACT(MONTH FROM order_date) = 7
) AS ranked
WHERE rn = 2;
```

Aggregate Window Functions
These apply aggregate logic across a moving window of rows:

Function	Description
SUM()	Running total across a partition
AVG()	Moving average
COUNT()	Row count within a window
MIN()	Minimum value in the window
MAX()	Maximum value in the window

Ranking Window Functions
Used to assign ranks or positions within partitions:

Function	Description
ROW_NUMBER()	Sequential row number (no ties)
RANK()	Rank with gaps for ties
DENSE_RANK()	Rank without gaps for ties
NTILE(n)	Divides rows into n buckets
🔁 Value-Based Window Functions
These let you access values from other rows relative to the current one:

Function	Description
LAG()	Value from a previous row
LEAD()	Value from a following row
FIRST_VALUE()	First value in the window
LAST_VALUE()	Last value in the window
NTH_VALUE(n)	nth value in the window

Statistical & Distribution Functions (engine-dependent)
Function	Description
PERCENT_RANK()	Relative rank as a percentage
CUME_DIST()	Cumulative distribution

--- 
In a 1-year experience interview, you aren't expected to be a database administrator, but you **are** expected to know how to "clean" and "summarize" data.

Here is a "Cheat Sheet" of the most common functions that will save your life during a technical screen.

---

### 1. The "Time Strippers" (Date/Time Functions)

These are used to bucket data for trends or reports.

| Function | What it does | Example Use Case |
| --- | --- | --- |
| **`HOUR(ts)`** | Extracts 0–23 | "Find the busiest hour of the day." |
| **`DATE(ts)`** | Removes the time | "Calculate total daily traffic volume." |
| **`DATEDIFF()`** | Difference between two dates | "How long was this circuit down?" |
| **`NOW()`** | Gets the exact current time | "Filter for logs from the last 24 hours." |

---

### 2. The "Cleaners" (Data Quality Functions)

Data from routers is often messy. These functions fix it.

| Function | What it does | Why it’s handy |
| --- | --- | --- |
| **`COALESCE(val, 0)`** | Replaces `NULL` with `0` | If a sensor was off, don't let it break your math. |
| **`ROUND(val, 2)`** | Limits decimal places | Makes "850.3333333" look like "850.33" for a report. |
| **`TRIM(str)`** | Removes extra spaces | Fixes "Gig0/1 " (with a space) so it matches "Gig0/1". |
| **`UPPER() / LOWER()`** | Forces case | Ensures "Core-R1" and "core-r1" are treated as the same device. |

---

### 3. The "Analyzers" (Aggregates & Logic)

These are for when the boss wants a "Summary" rather than a "List."

* **`DISTINCT`**: `SELECT COUNT(DISTINCT device_id)` — Tells you how many *unique* routers you have, ignoring duplicates.
* **`CASE WHEN`**: This is like an `if/else` statement inside SQL.
> *Example:* `CASE WHEN error_count > 100 THEN 'Critical' ELSE 'Normal' END as status`


* **`SUM()` / `AVG()` / `MAX()**`: The "Big Three" for capacity planning.

---

### 4. The "Pro" Window Functions

Mentioning these at the 1-year mark makes you look like a 3-year veteran.

* **`LAG()`**: Look at the previous row (Rate of change).
* **`LEAD()`**: Look at the next row.
* **`RANK() OVER (ORDER BY traffic DESC)`**: Automatically numbers your devices from #1 to #10 based on usage.

---

### How to use this list in an interview

If you get stuck on a question, use these as "building blocks."

**Interviewer:** *"Find the total traffic for each day last week."*
**You:** *"Okay, I'll use **DATE()** to group the timestamps into days, use **SUM()** for the traffic, and a **WHERE** clause with **NOW()** to limit it to the last 7 days."*

Even if you don't write the code perfectly, **saying that sentence** proves you know exactly what tools to use.

**Would you like me to give you a "Speed Round" of 3 quick questions to see if you can pick the right function for each?**







