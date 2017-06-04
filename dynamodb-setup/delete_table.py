from __future__ import print_function  # Python 2/3 compatibility
import boto3
import aws_keys

dynamodb = boto3.resource('dynamodb',
                          region_name=aws_keys.region_name,
                          aws_access_key_id=aws_keys.aws_access_key_id,
                          aws_secret_access_key=aws_keys.aws_access_key_id)
table = dynamodb.Table('pets')

table.delete()
