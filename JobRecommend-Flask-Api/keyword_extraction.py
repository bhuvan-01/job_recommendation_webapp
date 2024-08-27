from sklearn.feature_extraction.text import TfidfVectorizer

def extract_keywords(text, top_n=15):
    vectorizer = TfidfVectorizer(max_df=1, min_df=.95, stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    sorted_items = tfidf_matrix.toarray().flatten().argsort()[::-1]
    top_keywords = [feature_names[i] for i in sorted_items[:top_n]]
    return top_keywords
