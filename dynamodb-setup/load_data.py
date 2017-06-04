from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal
import requests
import aws_keys

dynamodb = boto3.resource('dynamodb',
                          region_name=aws_keys.region_name,
                          aws_access_key_id=aws_keys.aws_access_key_id,
                          aws_secret_access_key=aws_keys.aws_access_key_id)
table = dynamodb.Table('pets')

def get_attribute(x):
    return x['$t'].strip()  if '$t' in x else ""

def get_attribute_list(x):
    if len(x) > 1:
        return set([opt['$t'] for opt in x])
    return set([x['$t']])

def load_zip_codes():
    with open('zipcodelist.txt', 'r') as f:
        zipcodelist = [line.strip() for line in f]
    return zipcodelist

def add_data(item, fieldname, x):
    if x:
        item[fieldname] = x


if __name__ == '__main__':
    zipcodelist = load_zip_codes()

    for zipc in zipcodelist:
        print(zipc)
        # set up get request
        url = "http://api.petfinder.com/pet.find?key=" +\
                "PETFINDER_API_KEY"+ "&location=" +\
                zipc + "&animal=dog&format=json"
        r = requests.get(url)
        json_resp = r.json()

        # handle invalid zipcode
        if not 'pets' in json_resp['petfinder']:
            print("invalid zip")
            continue # invalid zipcode

        petdata = json_resp['petfinder']['pets']['pet']

        # extract data
        items = []
        for pet in petdata:
            options = get_attribute_list(pet['options']['option']) if\
                    pet['options'] else []
            status = True if get_attribute(pet['status']) == 'A' else False
            phone = get_attribute(pet['contact']['phone'])
            state = get_attribute(pet['contact']['state'])
            address = get_attribute(pet['contact']['address1'])
            email = get_attribute(pet['contact']['email'])
            city = get_attribute(pet['contact']['city'])
            zipcode = int(get_attribute(pet['contact']['zip']))
            age = get_attribute(pet['age'])
            photos = get_attribute_list(pet['media']['photos']['photo']) if\
                    pet['media'] else []
            idnum = int(get_attribute(pet['id']))
            breeds = get_attribute_list(pet['breeds']['breed'])
            name = get_attribute(pet['name'])
            sex = get_attribute(pet['sex'])
            desc = get_attribute(pet['description'])
            mix = True if get_attribute(pet['mix']) == 'yes' else False
            shelterId = get_attribute(pet['shelterId'])
            animal = get_attribute(pet['animal'])

            print("Adding pet: " + str(idnum))

            # set up table entry
            item = {}
            add_data(item, 'options', options)
            add_data(item, 'status', status)
            add_data(item, 'phone', phone)
            add_data(item, 'state', state)
            add_data(item, 'address', address)
            add_data(item, 'email', email)
            add_data(item, 'city', city)
            add_data(item, 'zipcode', zipcode)
            add_data(item, 'age', age)
            add_data(item, 'photos', photos)
            add_data(item, 'idnum', idnum)
            add_data(item, 'breeds', breeds)
            add_data(item, 'name', name)
            add_data(item, 'sex', sex)
            add_data(item, 'desc', desc)
            add_data(item, 'mix', mix)
            add_data(item, 'shelterId', shelterId)
            add_data(item, 'animal', animal)

            # push to table
            items.append(item)
        with table.batch_writer() as batch:
            for i in items:
                batch.put_item(i)
