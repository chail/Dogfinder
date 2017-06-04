from __future__ import print_function

import mysql.connector
import csv
import getpass

# get password
password = getpass.getpass();

# connect to local host
config = {
  'user': 'root',
  'password': password,
  'host': 'localhost',
  'raise_on_warnings': True,
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# create database
DB_NAME = 'breeds'
cur.execute('CREATE DATABASE ' + DB_NAME +';');

# switch to created database
cur.execute("USE " + DB_NAME+';')

# read csv to determine columns
csv_name ="breed_info.csv"
csv_file = open(csv_name, 'r')
reader = csv.DictReader(csv_file)
attributes = reader.fieldnames
key_attribute = attributes[0];
value_attributes = attributes[1:]

# create table
table_value_attributes = ",".join(attribute + " INTEGER NOT NULL" for attribute in value_attributes)
TABLE_NAME = "dog_breeds"
TABLE = "CREATE TABLE "+ TABLE_NAME + " ("+key_attribute+" varchar(50) PRIMARY KEY," + table_value_attributes+ ");"
cur.execute(TABLE);

csv_file.close()
cnx.close()