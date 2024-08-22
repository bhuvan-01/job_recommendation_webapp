# from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.feature_extraction.text import TfidfVectorizer
# import numpy as np

# def recommend(user_data, job_data):
#     recommendations = []

#     user_id_str = str(user_data.get("_id", ""))  # Ensure we have the user's ID as a string

#     for job in job_data:
#         score = 0

#         # Skill Matching
#         job_skills = set(job.get("requirements", []))
#         user_skills = set(user_data["skills"])
#         skill_match_score = len(user_skills.intersection(job_skills)) / len(job_skills) if job_skills else 0
#         score += skill_match_score * 0.4  # Assign weight to skill match

#         # Experience Matching
#         job_experience = job.get("experience", "")
#         user_experience = user_data.get("experience", [])

#         # Ensure both job_experience and user_experience are handled correctly
#         if isinstance(job_experience, list):
#             job_experience = [exp.lower() for exp in job_experience]
#         else:
#             job_experience = [job_experience.lower()]

#         if isinstance(user_experience, list):
#             user_experience = [exp.lower() for exp in user_experience]
#         else:
#             user_experience = [user_experience.lower()]

#         if any(exp in user_experience for exp in job_experience):
#             score += 0.3  # Assign weight to experience match

#         # Title/Description Matching (NLP)
#         job_title = job.get("title", "")
#         job_description = job.get("description", "")
#         user_bio = user_data.get("bio", "")

#         # Create TF-IDF vectors
#         tfidf = TfidfVectorizer().fit_transform([job_title + " " + job_description, user_bio])
#         title_description_match_score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
#         score += title_description_match_score * 0.2  # Assign weight to title/description match

#         # Location/Job Type Matching
#         if job.get("locationType", "").lower() == "remote" or job.get("location", "").lower() in user_data.get("location", "").lower():
#             score += 0.1  # Assign weight to location match

#         # Check if the job is saved by the user
#         if user_id_str in job.get("savedBy", []):
#             score += 0.1  # Additional score for saved jobs

#         # Check if the job is applied by the user
#         for application in job.get("applications", []):
#             if user_id_str == str(application.get("user")):
#                 score += 0.2  # Additional score for applied jobs
#                 break  # No need to check further once we've found a match

#         recommendations.append((job["_id"], score))

#     # Sort jobs by score in descending order
#     recommendations.sort(key=lambda x: x[1], reverse=True)

#     # Return the top recommendations
#     top_recommendations = [str(job_id) for job_id, _ in recommendations[:10]]  # Return top 10 recommendations
#     return top_recommendations



# from bson import ObjectId
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from flask_pymongo import PyMongo
# from dotenv import load_dotenv
# import os
# from recommendation2 import recommend
# load_dotenv()
# from bson.json_util import dumps
# from parser import parse_query_spacy

# app = Flask(__name__)
# CORS(app)

# mongo_uri = os.getenv("MONGO_URI")

# if not mongo_uri:
#     raise ValueError("No MONGO_URI found. Please ensure it is set in the .env file.")
# app.config["MONGO_URI"] = mongo_uri

# mongo = PyMongo(app)


# def convert_objectid_to_str(data):
#     if isinstance(data, list):
#         for i in range(len(data)):
#             data[i] = convert_objectid_to_str(data[i])
#     elif isinstance(data, dict):
#         for key, value in data.items():
#             if isinstance(value, ObjectId):
#                 data[key] = str(value)
#             elif isinstance(value, (dict, list)):
#                 data[key] = convert_objectid_to_str(value)
#     return data


# @app.route("/")
# def hello():
#     return "Welcome to the flask Api: server is running now"


# @app.route("/recommendedjob/<user_id>", methods=["GET"])
# def recommandedjobs(user_id):
    
#     # Fetch user data from the database
#     user_profile = mongo.db.users.find_one({"_id": ObjectId(user_id)})

#     if user_profile is None:
#         return jsonify({"error": "User not found"}), 404
    
    
    
#     job_data = list(mongo.db.jobs.find())
    
#     job_data = convert_objectid_to_str(job_data)
    
#     saved_jobs = []
#     applied_jobs = []
    
#     for job in job_data:
#             job_id = str(job["_id"])
    
#     if user_id in job.get("savedBy", []):
#                 saved_jobs.append(job_id)
                
                
#     for application in job.get("applications", []):
#                 if user_id == str(application.get("user")):
#                     applied_jobs.append(job_id)
#                     break  

    
#     user_data = {
#         "firstName": user_profile.get("firstName", ""),
#         "lastName": user_profile.get("lastName", ""),
#         "email": user_profile.get("email", ""),
#         "bio": user_profile.get("bio", ""),
#         "skills": user_profile.get("profile", {}).get("skills", []),
#         "languages": user_profile.get("profile", {}).get("languages", []),
#         "resume": user_profile.get("profile", {}).get("resume", ""),
#         "experience": user_profile.get("profile", {}).get("experience", []),
#         "projects": user_profile.get("profile", {}).get("projects", []),
#         "education": user_profile.get("profile", {}).get("education", []),
#         "certifications": user_profile.get("profile", {}).get("certifications", []),
#         "achievements": user_profile.get("profile", {}).get("achievements", []),
#          "saved_jobs": saved_jobs, 
#         "applied_jobs": applied_jobs, 
#     }

        
#     top_recommendations = recommend(user_data, job_data)   
    
#     return jsonify({"recommended_jobs": top_recommendations})  
        

 


# @app.route("/parse-query", methods=["POST"])
# def parse_query():
#     data = request.json
#     query = data.get("query", "")
#     if not query:
#         return jsonify({"error": "Query not provided"}), 400

#     parsed_query = parse_query_spacy(query)
#     return jsonify(parsed_query)


# if __name__ == "__main__":
#     app.run(port=8080)
