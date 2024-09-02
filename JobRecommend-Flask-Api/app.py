from bson import ObjectId
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from bson.json_util import dumps
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

    job_data = list(mongo.db.jobs.find())
    recommendations = recommend(user_profile["profile"], job_data)
    return dumps(recommendations)


if __name__ == "__main__":
    app.run(port=8080, debug=True)
