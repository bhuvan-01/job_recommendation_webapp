import re
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

currencies = ["USD", "CAD", "EUR"]

def parse_currency(query):
    for curr in currencies:
        if curr in query:
            return curr
    return "USD"  # Default to USD if no currency is specified


def parse_salary_range(query):
    min_salary = None
    max_salary = None

    # Handle salary range with hyphen (e.g., "50k-60k")
    range_match = re.search(r"(\d+k|\d+)\s*-\s*(\d+k|\d+)", query)
    if range_match:
        min_salary = parse_salary(range_match.group(1))
        max_salary = parse_salary(range_match.group(2))

    # Handle salary range with "to" (e.g., "50k to 60k")
    to_range_match = re.search(r"(\d+k|\d+)\s*to\s*(\d+k|\d+)", query)
    if to_range_match:
        min_salary = parse_salary(to_range_match.group(1))
        max_salary = parse_salary(to_range_match.group(2))

    # Handle salary above a certain amount (e.g., "over 70k")
    above_match = re.search(r"over\s*(\d+k|\d+)", query)
    if above_match:
        min_salary = parse_salary(above_match.group(1))

    # Handle salary below a certain amount (e.g., "under 40k")
    below_match = re.search(r"under\s*(\d+k|\d+)", query)
    if below_match:
        max_salary = parse_salary(below_match.group(1))

    # Handle single salary amount (e.g., "55k")
    single_match = re.search(r"(\d+k|\d+)", query)
    if single_match and min_salary is None and max_salary is None:
        min_salary = parse_salary(single_match.group(1))
        max_salary = min_salary

    return {"min": min_salary, "max": max_salary}


def parse_salary(salary_text):
    match = re.match(r"(\d+)(k?)", salary_text)
    if match:
        amount = int(match.group(1))
        if match.group(2) == "k":
            amount *= 1000
        return amount
    return None


def parse_query_spacy(query):
    doc = nlp(query)

    # Extract experience level
    experience_levels = ["entry", "junior", "mid", "senior", "expert"]
    experience = next((level for level in experience_levels if level in query.lower()), "")
    # Extract salary range or individual salary
    salary_range = parse_salary_range(query)

    # Extract currency unit if mentioned
    currency = parse_currency(query)

    # Extract job title (nouns and proper nouns, excluding known salary and experience tokens)
    title_tokens = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]

    # Remove salary and experience related tokens from title
    salary_related_tokens = re.findall(r"\d+k|\d+", query)
    experience_related_tokens = [level for level in experience_levels if level in query]
    remove_tokens = (
        salary_related_tokens
        + experience_related_tokens
        + experience_levels
        + currencies
        + [
            "k",
            "to",
            "over",
            "under",
            "with",
            "a",
            "of",
            "role",
            "looking",
            "for",
            "under",
            "above",
            "level",
            "earning",
        ]
    )
    title_tokens = [
        token
        for token in title_tokens
        if token not in remove_tokens and not token.isdigit()
    ]

    return {
        "title": title_tokens,
        "experience": experience,
        "salaryRange": salary_range,
        "currency": currency,
    }
