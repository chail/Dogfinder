from __future__ import print_function

import mysql.connector

# connect to local host locations db
config = {
  'user': 'root',
  'password': 'student',
  'host': 'localhost',
  'database': 'locations',
  'raise_on_warnings': True
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# drop tables
cur.execute("DROP TABLE Location")
cur.execute("DROP TABLE Zipcode")

# drop database
cur.execute("DROP DATABASE locations")

# close connection
cxn.close()