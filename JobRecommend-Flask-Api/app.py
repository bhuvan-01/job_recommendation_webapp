
from bson import ObjectId
from flask import Flask,jsonify
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from recommendation import recommend
load_dotenv()
from bson.json_util import dumps


app = Flask(__name__)

mongo_uri = os.getenv("MONGO_URI") 

if not mongo_uri:
    raise ValueError("No MONGO_URI found. Please ensure it is set in the .env file.")
app.config["MONGO_URI"] = mongo_uri

mongo = PyMongo(app)

@app.route('/')
def hello():
    return "Welcome to the flask Api: server is running now"


@app.route('/recommededjob/<user_id>', methods=['GET'])
def recommandedjobs(user_id):
    
     # Fetch user data from the database
    user_profile = mongo.db.users.find_one({"_id": ObjectId(user_id)})    
    
    if user_profile is None:
        return jsonify({"error": "User not found"}), 404

    # Fetch all job data from the database
    job_data = list(mongo.db.jobs.find())
    recommendations = recommend(user_profile['profile'], job_data)
    return dumps(recommendations)
          


if __name__ == '__main__':
    app.run(debug=True)
