import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
from keyword_extraction import extract_keywords

def recommend(user_profile, job_data):
    # Extract content-based features for the user
    user_text = str(user_profile)
    user_keywords = extract_keywords(user_text, top_n=15)
    print(f"Extracted Keywords for User: {user_keywords}")
    
    # Process each job and extract relevant features
    job_keywords_list = []
    for idx, job in enumerate(job_data):
        job_text = f"{job.get('title', '')} {job.get('description', '')} {' '.join(job.get('requirements', []))} {job.get('location', '')}"
        job_keywords = extract_keywords(job_text, top_n=15)
        job_keywords_list.append(job_keywords)
        print(f"Extracted Keywords for Job {idx+1} ({job.get('title', '')}): {job_keywords}")  # Print job keywords
    
    # Encode the keywords using MultiLabelBinarizer
    mlb = MultiLabelBinarizer()
    user_keyword_vector = mlb.fit_transform([user_keywords])
    job_keyword_vectors = mlb.transform(job_keywords_list)

    # Calculate content-based similarity scores
    content_similarity_scores = cosine_similarity(user_keyword_vector, job_keyword_vectors)[0]

    # Consider collaborative filtering features (saved jobs, applied jobs)
    saved_jobs = user_profile.get('saved_jobs', [])
    applied_jobs = user_profile.get('applied_jobs', [])

    collaborative_scores = np.zeros(len(job_data))
    for i, job in enumerate(job_data):
        job_id = str(job['_id'])
        if job_id in saved_jobs:
            collaborative_scores[i] += 1  # You can adjust the weight
        if job_id in applied_jobs:
            collaborative_scores[i] += 2 

    # Combine content-based and collaborative scores
    combined_scores = 0.7 * content_similarity_scores + 0.3 * collaborative_scores  # Adjust weights as needed

    # Print scores for debugging
    for i, job in enumerate(job_data):
        print(f"Job: {job.get('title', '')}, Content Similarity: {content_similarity_scores[i]}, Collaborative Score: {collaborative_scores[i]}, Combined Score: {combined_scores[i]}")

    # Rank jobs based on combined scores
    ranked_jobs_indices = np.argsort(-combined_scores)
    ranked_jobs_with_scores = [(job_data[idx], combined_scores[idx]) for idx in ranked_jobs_indices]

    # Include ranks and filter based on a score threshold (lowered threshold for testing)
    ranked_jobs_with_ranks = []
    for rank, (job, score) in enumerate(ranked_jobs_with_scores, start=1):
        if score > 0.1:  # Lowered threshold for testing purposes
            job_with_rank = job.copy()
            job_with_rank['rank'] = rank
            job_with_rank['combined_score'] = score
            ranked_jobs_with_ranks.append(job_with_rank)

    return ranked_jobs_with_ranks[:10]
