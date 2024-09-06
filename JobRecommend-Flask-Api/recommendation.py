import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
nltk.download("stopwords")
nltk.download('punkt_tab')

stop_words = set(stopwords.words("english"))


def remove_stop_words(text):
    return list(filter(lambda x: x.lower() not in stop_words, word_tokenize(text)))


def recommend(user_profile, user_jobs, job_data):
    # Step 1: Skill Matching
    mlb = MultiLabelBinarizer()
    user_skills = [user_profile["skills"]]
    job_skills = [job["requirements"] for job in job_data]

    mlb.fit(user_skills + job_skills)
    user_skill_vector = mlb.transform(user_skills)
    job_skill_vectors = mlb.transform(job_skills)

    skill_similarity_scores = cosine_similarity(user_skill_vector, job_skill_vectors)[0]

    # Step 2: Bio and Experience Matching with Job Description
    tfidf_vectorizer = TfidfVectorizer()

    user_bio = user_profile.get("bio", "")
    user_experience = " ".join(
        [
            exp.get("role", "") + " " + exp.get("description", "")
            for exp in user_profile.get("experience", [])
        ]
    )
    user_text = user_bio + " " + user_experience
    user_text = " ".join(remove_stop_words(user_text))

    job_descriptions = [job["description"] for job in job_data]

    # Fit and transform user text and job descriptions
    text_data = [user_text] + job_descriptions
    tfidf_matrix = tfidf_vectorizer.fit_transform(text_data)

    bio_experience_similarity_scores = cosine_similarity(
        tfidf_matrix[0:1], tfidf_matrix[1:]
    )[0]

    # Step 3: User Jobs Matching with All Jobs (Title, Requirements, Job Type, and Description)

    def create_job_text(job):
        title = job.get("title", "")
        requirements = " ".join(job.get("requirements", []))
        description = job.get("description", "")
        job_type = job.get("jobType", "")
        return f"{title} {requirements} {description} {job_type}"

    # Create composite texts for user jobs and all jobs
    user_job_texts = [create_job_text(job) for job in user_jobs]
    all_job_texts = [create_job_text(job) for job in job_data]

    # Fit TF-IDF on user jobs and all jobs
    if user_job_texts: 
        job_tfidf_matrix = tfidf_vectorizer.fit_transform(
            user_job_texts + all_job_texts
        )
        user_jobs_similarity_scores = np.mean(
            cosine_similarity(
                job_tfidf_matrix[: len(user_job_texts)],
                job_tfidf_matrix[len(user_job_texts) :],
            ),
            axis=0,
        )
    else:
        user_jobs_similarity_scores = np.zeros(len(all_job_texts))

   
    # Step 4: Combine Similarity Scores
    combined_scores = (
        0.5 * skill_similarity_scores
        + 0.25 * bio_experience_similarity_scores
        + 0.25 * user_jobs_similarity_scores
    )

    # Debug: Print Combined Scores
    print("Combined Scores:", combined_scores)

    # Step 5: Rank Jobs Based on Combined Similarity Scores
    ranked_jobs_indices = np.argsort(-combined_scores)
    ranked_jobs_with_scores = [
        (job_data[idx], combined_scores[idx]) for idx in ranked_jobs_indices
    ]

    # Step 6: Include Ranks in the Job Details
    ranked_jobs_with_ranks = []
    for rank, (job, score) in enumerate(ranked_jobs_with_scores, start=1):
        if score > 0.2:
            job_with_rank = job.copy()
            job_with_rank["rank"] = rank
            job_with_rank["similarity_score"] = score
            ranked_jobs_with_ranks.append(job_with_rank)

    # Return only the top 10 jobs
    return ranked_jobs_with_ranks[:10]
