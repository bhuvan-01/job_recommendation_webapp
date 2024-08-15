import csv
import random
from pymongo import MongoClient
from bson import ObjectId


# Connect to MongoDB
client = MongoClient(
    "mongodb+srv://job-portal:BHUlei272@job-portal.tbvdt6i.mongodb.net/test?retryWrites=true&w=majority&appName=Job-portal"
)
db = client["test"]
jobs_collection = db["jobs"]


# Function to load CSV data into lists
def load_csv(file_name):
    with open(file_name, mode="r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        return [row[0] for row in reader]


# Load variations from CSV files
titles = load_csv("titles.csv")
descriptions = load_csv("descriptions.csv")
requirements = [req.split(", ") for req in load_csv("requirements.csv")]
locations = load_csv("locations.csv")
salaries = load_csv("salaries.csv")

# Fixed variations for these fields
experience_levels = [
    "Internship",
    "Entry Level",
    "Associate",
    "Mid Level",
    "Senior Level",
]
job_types = ["Part-Time", "Full-Time", "Internship", "Contract", "Temporary"]
location_types = ["Remote", "On-Site", "Hybrid"]
industries = ["IT", "Healthcare", "Finance", "Education", "Retail"]


companies_collection = db["companies"]
companies_data = list(companies_collection.find({}))
company_ids = [company["_id"] for company in companies_data]


# Function to generate random latitude and longitude within a plausible range
def generate_random_coordinates():
    latitude = round(random.uniform(-90.0, 90.0), 4)
    longitude = round(random.uniform(-180.0, 180.0), 4)
    return latitude, longitude


# Function to generate job variations
def generate_job_variation():
    latitude, longitude = generate_random_coordinates()
    job_variation = {
        "title": random.choice(titles),
        "description": random.choice(descriptions),
        "requirements": random.choice(requirements),
        "experience": random.choice(experience_levels),
        "jobType": random.choice(job_types),
        "locationType": random.choice(location_types),
        "industry": random.choice(industries),
        "location": random.choice(locations),
        "salary": random.choice(salaries),
        "company": random.choice(company_ids),  # Randomly assign a company
        "latitude": latitude,
        "longitude": longitude,
        "applications": [],
        "savedBy": [],
    }
    return job_variation


# Generate and insert 2000 records
bulk_jobs = []
for _ in range(2000):
    job = generate_job_variation()
    bulk_jobs.append(job)

# Bulk insert into MongoDB
jobs_collection.insert_many(bulk_jobs)

print(f"Inserted {len(bulk_jobs)} job records into MongoDB.")
