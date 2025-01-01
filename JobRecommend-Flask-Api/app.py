from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from bson.json_util import dumps, loads
from recommendation import recommend

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

@app.route("/recommendedjob/<user_id>", methods=["GET"])
def recommended_jobs(user_id):
    user_profile = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user_profile is None:
        return jsonify({"error": "User not found"}), 404

    

    # Fetch jobs where the user saved and applied
    applied_jobs = list(mongo.db.jobs.find({"applications.user": ObjectId(user_id)}))
    saved_jobs = list(mongo.db.jobs.find({"savedBy": ObjectId(user_id)}))

    # Fetch all available jobs
    all_jobs = list(mongo.db.jobs.find())
    

    # Merge applied and saved jobs into one list (no duplicates)
    job_ids = set() 
    user_jobs = []
    
    for job in applied_jobs + saved_jobs:
        job_id_str = str(job["_id"])  
        if job_id_str not in job_ids:
            user_jobs.append(job)
            job_ids.add(job_id_str)


    recommendations = recommend(user_profile["profile"], user_jobs, all_jobs)

    # Save the recommended jobs data into 'userjobs.json'
    recommendations_json = dumps(recommendations)
    with open('userrecommendjobs.json', 'w') as f:
        f.write(recommendations_json)

    return recommendations_json


if __name__ == "__main__":
    app.run(port=8080, debug=True)
