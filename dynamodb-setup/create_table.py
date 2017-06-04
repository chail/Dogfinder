from __future__ import print_function  # Python 2/3 compatibility
import boto3
import aws_keys

dynamodb = boto3.resource('dynamodb',
                          region_name=aws_keys.region_name,
                          aws_access_key_id=aws_keys.aws_access_key_id,
                          aws_secret_access_key=aws_keys.aws_access_key_id)

table = dynamodb.create_table(
    TableName='pets',
    KeySchema=[
        {
            'AttributeName': 'idnum',
            'KeyType': 'HASH'  # Partition key
        },
        {
            'AttributeName': 'zipcode',
            'KeyType': 'RANGE'  # Sort key
        },
    ],
    AttributeDefinitions=[  # must contain these attribs
        {
            'AttributeName': 'idnum',
            'AttributeType': 'N'
        },
        {
            'AttributeName': 'zipcode',
            'AttributeType': 'N'
        },
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)

print("Table status:", table.table_status)
