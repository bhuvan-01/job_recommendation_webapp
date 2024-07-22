
from flask import Flask,request, jsonify
from recommendation import recommend


app = Flask(__name__)


users = [
    {
        "user_id": 1,
        "name": "John Doe",
        "skills": ["python", "machine learning", "data analysis"]
    },
    {
        "user_id": 2,
        "name": "Jane Smith",
        "skills": ["javascript", "react", "nodejs"]
    }
]

jobs = [
    {
        "job_id": 1,
        "title": "Data Scientist",
        "skills_required": ["python", "machine learning", "statistics"]
    },
    {
        "job_id": 2,
        "title": "Frontend Developer",
        "skills_required": ["javascript", "react", "css"]
    },
    {
        "job_id": 3,
        "title": "Backend Developer",
        "skills_required": ["nodejs", "express", "mongodb"]
    }
]


@app.route('/')
def hello():
    return "Welcome to the flask Api: server is running now"


@app.route('/recommededjob/<int:user_id>', methods=['GET'])
def recommandedjobs(user_id):
     user_profile = next((user for user in users if user['user_id'] == user_id), None)
     if user_profile is None:
        return jsonify({"error": "User not found"}), 404
    
     recommendations = recommend(user_profile, jobs)
     return jsonify(recommendations)
          


if __name__ == '__main__':
    app.run(debug=True)
