import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend(user_profile, job_data):
    # Encode user and job skills
    mlb = MultiLabelBinarizer()
    user_skills = [user_profile["skills"]]
    job_skills = [job["skills_required"] for job in job_data]

    mlb.fit(user_skills + job_skills)
    user_skill_vector = mlb.transform(user_skills)
    job_skill_vectors = mlb.transform(job_skills)

    # Calculate content-based similarity scores
    similarity_scores = cosine_similarity(user_skill_vector, job_skill_vectors)[0]

    # Rank jobs based on similarity scores
    ranked_jobs_indices = np.argsort(-similarity_scores)
    ranked_jobs_with_scores = [(job_data[idx], similarity_scores[idx]) for idx in ranked_jobs_indices]

    # Include ranks in the job details
    ranked_jobs_with_ranks = []
    for rank, (job, score) in enumerate(ranked_jobs_with_scores, start=1):
        job_with_rank = job.copy()  # Create a copy to avoid modifying the original job data
        job_with_rank['rank'] = rank
        job_with_rank['similarity_score'] = score
        ranked_jobs_with_ranks.append(job_with_rank)

    return ranked_jobs_with_ranks
