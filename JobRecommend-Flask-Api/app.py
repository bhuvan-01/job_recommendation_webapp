from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pickle

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb+srv://job-portal:BHUlei272@job-portal.tbvdt6i.mongodb.net/?retryWrites=true&w=majority&appName=Job-portal')
db = client['test']
def extract_text_from_field(field):
    """
    Helper function to extract text from a list of dictionaries or strings.
    """
    if isinstance(field, list):
        # If the field is a list, extract text from each item
        texts = []
        for item in field:
            if isinstance(item, dict):
                # Assuming each dictionary has a key 'name' or similar that contains the text
                texts.append(item.get("name", ""))
            elif isinstance(item, str):
                texts.append(item)
        return " ".join(texts)
    elif isinstance(field, str):
        return field
    return ""

def get_user_profile(user):
    # Extract text from skills and experience fields
    skills_text = extract_text_from_field(user["profile"]["skills"])
    experience_text = extract_text_from_field(user["profile"]["experience"])

    # Combine skills and experience into a single string
    user_profile = skills_text + " " + experience_text

    # Fetch jobs where the current user has saved or applied
    user_id = ObjectId(user["_id"])

    # Find jobs saved by the user
    saved_jobs = db.jobs.find({"savedBy": user_id})

    # Find jobs applied by the user
    applied_jobs = db.jobs.find({"applications.user": user_id})

    # Combine job descriptions of saved and applied jobs
    job_descriptions = []
    for job in saved_jobs:
        job_descriptions.append(get_job_description(job))
    for job in applied_jobs:
        job_descriptions.append(get_job_description(job))

    # Add the job descriptions to the user profile
    if job_descriptions:
        user_profile += " " + " ".join(job_descriptions)

    return user_profile

def get_job_description(job):
    # Combine job title, description, and requirements into a single string
    return job["title"] + " " + job["description"] + " " + " ".join(job["requirements"])

def get_recommendations(user_id):
    # Fetch the user data
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return []

    user_profile = get_user_profile(user)

    # Fetch all jobs with precomputed vectors
    jobs = db.jobs.find({"recommendation_cache.tfidf_vector": {"$exists": True}})
    
    job_ids = []
    job_descriptions = []

    for job in jobs:
        job_ids.append(str(job["_id"]))
        job_descriptions.append(get_job_description(job))
    
    # Combine user profile with all job descriptions for consistent vectorization
    all_documents = [user_profile] + job_descriptions

    # Vectorize the combined documents using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(all_documents)

    # The first vector corresponds to the user profile
    user_tfidf_vector = tfidf_matrix[0].toarray()

    # The rest corresponds to the job descriptions
    job_vectors = tfidf_matrix[1:].toarray()

    # Calculate cosine similarity between user profile vector and job vectors
    cosine_similarities = cosine_similarity(user_tfidf_vector, job_vectors).flatten()

    # Sort jobs by similarity score
    sorted_indices = np.argsort(cosine_similarities)[::-1]
    
    top_20_jobs = [job_ids[i] for i in sorted_indices[:20]]

    return top_20_jobs


@app.route('/recommendations/<user_id>', methods=['GET'])
def recommend_jobs(user_id):
    top_20_jobs = get_recommendations(user_id)
    return jsonify({"recommended_job_ids": top_20_jobs})

def update_recommendation_cache(job_id):
    # Fetch the specific job from the database  
    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise ValueError(f"Job with id {job_id} not found.")

    job_description = get_job_description(job)

    # Vectorize the job description using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_vector = vectorizer.fit_transform([job_description]).toarray().flatten()

    # Serialize the vector using pickle to store it in MongoDB
    tfidf_vector_serialized = pickle.dumps(tfidf_vector).decode('latin1')

    # Update the job document with the new vector in the recommendation_cache
    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"recommendation_cache.tfidf_vector": tfidf_vector_serialized}}
    )

    return tfidf_vector_serialized

@app.route('/update_recommendation_cache/<job_id>', methods=['POST'])
def update_cache(job_id):
    updated_vector = update_recommendation_cache(job_id)
    return jsonify({"status": "success", "job_id": job_id, "updated_vector": updated_vector}), 200

if __name__ == '__main__':
    app.run(port=8080, debug=True)
