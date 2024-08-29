from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from recommendation import recommend
from keyword_extraction import extract_keywords  # Assuming you have a keyword extraction module
from bson.json_util import dumps
from parser import parse_query_spacy

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise ValueError("No MONGO_URI found. Please ensure it is set in the .env file.")
app.config["MONGO_URI"] = mongo_uri

mongo = PyMongo(app)


@app.route("/")
def hello():
    return "Welcome to the Flask API: server is running now"


# @app.route("/recommededjob/<user_id>", methods=["GET"])
# def recommandedjobs(user_id):
#     # Fetch user data from the database
#     user_profile = mongo.db.users.find_one({"_id": ObjectId(user_id)})

#     if user_profile is None:
#         return jsonify({"error": "User not found"}), 404

#     # Fetch all job data from the database
#     job_data = list(mongo.db.jobs.find())

#     # Use the recommendation function to get job recommendations
#     recommendations = recommend(user_profile["profile"], job_data)
#     return dumps(recommendations)


@app.route("/parse-query", methods=["POST"])
def parse_query():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query not provided"}), 400

    parsed_query = parse_query_spacy(query)
    return jsonify(parsed_query)


@app.route("/extract-job-keywords/<job_id>", methods=["POST"])
def extract_job_keywords(job_id):
    # Fetch the job from the database based on the job ID
    job = mongo.db.jobs.find_one({"_id": ObjectId(job_id)})

    if job is None:
        return jsonify({"error": "Job not found"}), 404

    # Extract keywords for the job
    job_text = f"{job.get('title', '')} {job.get('description', '')} {' '.join(job.get('requirements', []))} {job.get('location', '')}"
    job_keywords = extract_keywords(job_text, top_n=15)

    # Update the job document with the extracted keywords
    mongo.db.jobs.update_one({"_id": ObjectId(job_id)}, {"$set": {"keywords": job_keywords}})

    return jsonify({"message": "Keywords extracted and job updated", "keywords": job_keywords})


@app.route("/user-recommendations", methods=["POST"])
def user_recommendations():
    data = request.json
    user_id = data.get("user_id")
    saved_jobs = data.get("saved_jobs", [])
    applied_jobs = data.get("applied_jobs", [])

    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400

    # Fetch user data from the database
    user_profile = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if user_profile is None:
        return jsonify({"error": "User not found"}), 404

    # Update user's saved jobs and applied jobs
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"saved_jobs": saved_jobs, "applied_jobs": applied_jobs}}
    )

    # Fetch all job data from the database
    job_data = list(mongo.db.jobs.find())

    # Use the recommendation function to get job recommendations
    recommendations = recommend(user_profile["profile"], job_data)

    # Extract just the job IDs from the recommendations
    recommended_job_ids = [str(job["_id"]) for job in recommendations]

    return jsonify({"recommended_job_ids": recommended_job_ids})


if __name__ == "__main__":
    app.run(port=8080, debug=True)
