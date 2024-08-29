from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pickle
from pymongo import MongoClient


# Connect to MongoDB
client = MongoClient('mongodb+srv://job-portal:BHUlei272@job-portal.tbvdt6i.mongodb.net/?retryWrites=true&w=majority&appName=Job-portal')
db = client['test']

def get_job_description(job):
    return job["title"] + " " + job["description"] + " " + " ".join(job["requirements"])

# Fetch all jobs
jobs = db.jobs.find()

job_descriptions = []
job_ids = []

for job in jobs:
    job_description = get_job_description(job)
    job_descriptions.append(job_description)
    job_ids.append(job["_id"])

    # Vectorize job descriptions using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(job_descriptions)


# Store the TF-IDF vectors in the database
for i, job_id in enumerate(job_ids):
    print(i, end="\n")
    tfidf_vector = tfidf_matrix[i].toarray().flatten()

    # You may serialize the vector using pickle or store it directly as a list
    tfidf_vector_serialized = pickle.dumps(tfidf_vector).decode('latin1')  # or store it as a list
  # Corrected update_one call with the $set operator
    db.jobs.update_one(
        {"_id": job_id},
        {"$set": {"recommendation_cache.tfidf_vector": tfidf_vector_serialized}}
    )

    