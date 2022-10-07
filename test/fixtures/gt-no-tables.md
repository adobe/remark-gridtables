## single grid line

+---------+-----+


## open cells

+----+
| A0 |
+----+
| foo

## text after cell

+----+
| A0 |   foo ?
+----+

## open cell starts

+----+
| A0 |
+----+
| 

## no cell padding

+---------+
|Arabesque|
+---------+

## unterminated grids

+----+
| A0 |
+---foo
| B0 |
+----+

## wrong align

+>--:+
| A0 |
+----+

+:--<+
| A0 |
+----+

+:-:-+
| A0 |
+----+

+-vv-+
| A0 |
+----+
