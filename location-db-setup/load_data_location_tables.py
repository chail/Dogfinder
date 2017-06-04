from __future__ import print_function

import mysql.connector
import csv
import os.path

# connect to local host, and locations database
config = {
  'user': 'root',
  'password': 'student',
  'host': 'localhost',
  'database': 'locations',
  'raise_on_warnings': True
}
cnx = mysql.connector.connect(**config)
cur = cnx.cursor()

# create list of zipcodes with pets
zip_list_name = '../dynamodb-setup/zipcodelist.txt'
with open(zip_list_name, 'r') as f:
    pet_zipcodes = [line.strip() for line in f]
    
# convert pet zipcodes to set
pet_zipcodes = set(pet_zipcodes)

# read primary zipcode datasource
csv_name = '../free-zipcode-database-Primary.csv'
csv_file = open(csv_name, 'r')
reader = csv.DictReader(csv_file)
attributes = reader.fieldnames

# put data in table
for row in reader:
    if row["Decommisioned"] == "false":
        zip = row["Zipcode"]
        city = row["City"]
        state = row["State"]
        lat = row["Lat"]
        lng = row["Long"]
        is_pet_zip = "FALSE"
        if zip in pet_zipcodes:
            is_pet_zip = "TRUE"
        
        if len(zip) > 0 and len(city) > 0 and len(state) == 2 and len(lat) > 0 and len(lng) > 0:
            insert_zip = "INSERT INTO Zipcode (zipcode, lat, lng, is_pet_zip) VALUES (" + "\"" + zip + "\"" + "," + lat + "," + lng + "," + is_pet_zip + ");"
            insert_loc = "INSERT INTO Location (zipcode, city, state) VALUES (" + "\"" + zip + "\"" + "," + "\"" + city + "\"" + "," + "\"" + state + "\"" + ");"
            cur.execute(insert_zip);
            cur.execute(insert_loc);
        
        

# close files
csv_file.close()

# commit data
cnx.commit()

# close connection
cnx.close()