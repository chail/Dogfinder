from __future__ import print_function

import mysql.connector
import csv

# connect to local host, and breeds database
config = {
  'user': 'root',
  'password': 'student',
  'host': 'localhost',
  'raise_on_warnings': True
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# create location database and switch to it
DB_NAME = 'locations'
cur.execute('CREATE DATABASE ' + DB_NAME +';');
cur.execute("USE " + DB_NAME+';')

# create tables
ZIPCODE_TABLE = (
    "CREATE TABLE Zipcode ("
    "zipcode CHAR(5) PRIMARY KEY,"
    "lat DOUBLE NOT NULL,"
    "lng DOUBLE NOT NULL,"
    "is_pet_zip BOOLEAN NOT NULL"
    ");"

)
cur.execute(ZIPCODE_TABLE)

LOCATION_TABLE = (
    "CREATE TABLE Location ("
    "zipcode CHAR(5),"
    "city VARCHAR(100),"
    "state CHAR(2),"
    "PRIMARY KEY (zipcode, city)"
    ");"
)
cur.execute(LOCATION_TABLE)

# close connection to database
cur.close()