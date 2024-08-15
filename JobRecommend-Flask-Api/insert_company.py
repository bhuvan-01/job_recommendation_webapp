import pandas as pd
from pymongo import MongoClient


# Connect to MongoDB
client = MongoClient(
    "mongodb+srv://job-portal:BHUlei272@job-portal.tbvdt6i.mongodb.net/test?retryWrites=true&w=majority&appName=Job-portal"
)
db = client["test"]
collection = db["companies"]


# Read the CSV file into a DataFrame
df = pd.read_csv('companies.csv')

# Convert DataFrame to dictionary
companies = df.to_dict('records')

# Insert data into MongoDB
result = collection.insert_many(companies)

print(f"Inserted {len(result.inserted_ids)} company records into MongoDB.")
