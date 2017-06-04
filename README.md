# DogFinder
Simplify the pet finding process! built with Node and Amazon AWS

## Introduction
DogFinder is web-app that simplifies the dog adoption process. A simple quiz  is used to determine user preferences and find dog breeds that are suitable for them, while a database of zip codes and coordinates is used to determine areas near the user. This information is used to query a database of dogs available for adoption, in order to find dogs that are both close by and good matches. Users are able to create profiles in order to save their favorite dogs. 

## NoSQL database using DynamoDB
1. Setup: create an Access Key and Secret Key and select region, and put these as variables in dynamodb-setup/aws_keys.py (see [Boto Docs][boto])
2. We first scraped the top 1000 most populous zipcodes, and used this in our API calls to petfinder. We then used this to populate the DynamoDB table.
3. We used an API key from Petfinder to retrieve pet data. This will need to be added in dynamodb-setup/load_data.py

## SQL database setup
1. Code for populating dog breeds and zip codes table in location-db-setup and breed-db-setup folders.

## Run webpage
1. Add the Access Key and Secret Key to webpage/config.json 
2. Navigate to the webpage folder and run `node app.js`

## Code Organization

We structured the project into the following sections: 
- Models: A javascript file is included for each of the databases. These files handle setting up the connection with AWS and include the queries. 
- Routes: Handles routing logic for all get and post requests 
- Views: Contains EJS files that make up the front end. A "components" submodule contains views that are used throughout the website
- Images: Contains image files used in the view files 

## Core Functionality: 
- Users are able to log in to their profiles, and take a personality quiz, from which their preferences are inferred. Users are then able to input their zip code and see a list of dogs available for adoption that best match their needs, and are close by. This involves a query to determine nearby zipcodes, a query to determine compatible dog breeds, and query to the pets table to find pets that are both nearby and compatible, and a query to the user table if the user wants to save the pet.
- Users are also able to directly search for dogs in their geographical proximity without having to take the personality quiz. 

## Additional Features
- API Integration: A Twitter embedded search timeline was used as a motivating example, displaying posts with the hashtag \#puppy. Facebook social plug-ins were used to enable users to share content and support adoption organizations.
- User profiles were implemented, in order to allow users to save the state of their search by saving and managing their favorite dogs. Passwords are hashed before they are stored in order to ensure security. 
- Validator, an npm package, as well as custom regex checks, were used in order to avoid SQL injections from malicious users. 


[boto]: http://boto3.readthedocs.io/en/latest/guide/quickstart.html#configuration
