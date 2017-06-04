from __future__ import print_function

import mysql.connector
import csv

# connect to local host, and breeds database
config = {
  'user': 'root',
  'password': 'student',
  'host': 'localhost',
  'raise_on_warnings': True,
  'database':'breeds'
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# read csv to obtain data
csv_name ="breed_info.csv"
csv_file = open(csv_name, 'r')
reader = csv.DictReader(csv_file)
attributes = reader.fieldnames
key_attribute = attributes[0];
value_attributes = attributes[1:]

# load data into table
general_load_command = "INSERT INTO " + "dog_breeds" + " (" + ",".join(attributes) + ") "
for row in reader:
    load_command = general_load_command + "VALUES (\"" +row[key_attribute] +"\"," + ",".join(row[attribute] for attribute in value_attributes) + ");"
    cur.execute(load_command)
   
# close file read, and connection   
csv_file.close()
cnx.commit()