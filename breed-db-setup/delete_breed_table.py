from __future__ import print_function

import mysql.connector

# connect to local host locations db
config = {
  'user': 'root',
  'password': 'student',
  'host': 'localhost',
  'database': 'breeds',
  'raise_on_warnings': True
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# drop table
cur.execute("DROP TABLE dog_breeds")

# drop database
cur.execute("DROP DATABASE breeds")

# close connection
cnx.close()