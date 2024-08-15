# Define the data for each CSV
import csv
import random

# Variations for company schema fields
company_names = [
    "Tech Innovators",
    "Data Solutions",
    "Creative Minds",
    "HealthFirst",
    "RetailHub",
    "Finance Forward",
    "EduWorld",
    "Global Networks",
    "Eco Energy",
    "Future Ventures",
]

industries = [
    "IT",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Energy",
    "Consulting",
    "Manufacturing",
    "Transportation",
    "Real Estate",
]

locations = [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago",
    "London",
    "Berlin",
    "Sydney",
    "Tokyo",
    "Toronto",
    "Paris",
]

websites = [
    "https://www.techinnovators.com",
    "https://www.datasolutions.com",
    "https://www.creativeminds.com",
    "https://www.healthfirst.com",
    "https://www.retailhub.com",
    "https://www.financeforward.com",
    "https://www.eduworld.com",
    "https://www.globalnetworks.com",
    "https://www.ecoenergy.com",
    "https://www.futureventures.com",
]

overviews = [
    "Tech Innovators is a leading software development company specializing in innovative solutions.",
    "Data Solutions offers comprehensive data analysis and business intelligence services to help organizations make data-driven decisions.",
    "Creative Minds is a design agency focused on delivering unique and creative design solutions for businesses.",
    "HealthFirst is a healthcare provider committed to improving patient care through technology and innovation.",
    "RetailHub is an e-commerce platform providing a wide range of products to customers worldwide.",
    "Finance Forward provides financial consulting services, helping businesses achieve financial stability and growth.",
    "EduWorld is an educational technology company focused on providing learning solutions for students and educators.",
    "Global Networks is a telecommunications company offering high-speed internet and mobile services.",
    "Eco Energy is a renewable energy company dedicated to providing sustainable energy solutions.",
    "Future Ventures is a venture capital firm investing in emerging technologies and startups.",
]


# Function to write data to a CSV file
def write_to_csv(filename, header, data):
    with open(filename, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(header)
        for row in data:
            if isinstance(row, list):
                writer.writerow(row)
            elif isinstance(row, str):
                writer.writerow([row])


# Generate company data
company_data = []
for i in range(
    100
):  # Adjust the number to generate the desired amount of company records
    company = [
        random.choice(company_names),
        random.choice(industries),
        random.choice(locations),
        random.choice(websites),
        random.choice(overviews),
    ]
    company_data.append(company)

# Write company data to CSV
write_to_csv(
    "companies.csv",
    ["name", "industry", "location", "website", "overview"],
    company_data,
)

print("Generated company data and saved to companies.csv.")
roles = [
    "Software Engineer",
    "Data Analyst",
    "Product Manager",
    "UX Designer",
    "Systems Administrator",
    "Project Manager",
    "DevOps Engineer",
    "Business Analyst",
    "Network Engineer",
    "Database Administrator",
]


requirements = [
    "Python, Django, REST APIs",
    "SQL, Excel, Power BI",
    "Agile, Scrum, JIRA",
    "Adobe XD, Sketch, Figma",
    "Linux, Windows Server, AWS",
    "PMP, Agile, MS Project",
    "Docker, Kubernetes, AWS",
    "Business Analysis, UML, Data Modeling",
    "Cisco, Firewall, VPN",
    "SQL, NoSQL, Backup and Recovery",
    "Python, Django, and REST APIs",
    "SQL, Excel, and Power BI",
    "Agile methodologies",
    "Adobe XD and Figma",
    "Linux and AWS",
]


locations = [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago",
    "London",
    "Berlin",
    "Sydney",
    "Tokyo",
    "Toronto",
    "Paris",
]

salaries = ["60000", "70000", "80000", "90000", "100000", "120000", "150000"]


# Predefined sentences for job descriptions
sentences = [
    "The {role} is responsible for {responsibility}. They work closely with {collaboration} to achieve {goal}.",
    "The ideal candidate will have experience with {technology} and a strong understanding of {concept}.",
    "In this role, you will be expected to {task} and {task}, while ensuring {standard}.",
    "You will be working in a {environment} environment, where {skill} is essential.",
    "The {role} will be involved in {activity}, contributing to the overall {impact}.",
    "The position requires strong {skill} and the ability to {capability} under {condition}.",
    "The successful candidate will demonstrate {quality} and a commitment to {value}.",
    "You will collaborate with {department} to {objective} and help drive {outcome}.",
    "The {role} is expected to {responsibility}, ensuring {goal} and maintaining {standard}.",
    "The ideal candidate will bring a background in {field} and a passion for {focus}.",
]

responsibilities = [
    "the development of scalable software solutions",
    "the analysis of large datasets",
    "managing the product lifecycle",
    "designing user-friendly interfaces",
    "maintaining IT infrastructure",
]
collaborations = [
    "cross-functional teams",
    "other developers",
    "project managers",
    "stakeholders",
    "clients",
]
goals = [
    "project success",
    "business growth",
    "customer satisfaction",
    "product innovation",
    "system reliability",
]
concepts = [
    "software development best practices",
    "data visualization techniques",
    "product management frameworks",
    "user experience design principles",
    "IT infrastructure management",
]
tasks = [
    "write clean, maintainable code",
    "analyze complex data",
    "define product requirements",
    "create wireframes and prototypes",
    "configure and troubleshoot servers",
]
standards = [
    "high quality",
    "best practices",
    "security standards",
    "industry benchmarks",
    "technical excellence",
]
environments = ["fast-paced", "collaborative", "dynamic", "innovative", "supportive"]
skills = [
    "problem-solving",
    "analytical thinking",
    "creativity",
    "attention to detail",
    "technical expertise",
]
activities = [
    "code reviews",
    "data analysis",
    "product launches",
    "user testing",
    "network monitoring",
]
impacts = [
    "company success",
    "data-driven decisions",
    "product innovation",
    "user satisfaction",
    "system uptime",
]
conditions = [
    "tight deadlines",
    "changing requirements",
    "customer feedback",
    "high-pressure situations",
    "limited resources",
]
qualities = ["leadership", "teamwork", "communication", "adaptability", "integrity"]
values = [
    "excellence",
    "continuous improvement",
    "customer focus",
    "innovation",
    "collaboration",
]
departments = ["engineering", "product", "design", "IT", "analytics"]
objectives = [
    "deliver high-quality software",
    "extract valuable insights",
    "build successful products",
    "design intuitive user interfaces",
    "maintain secure and reliable systems",
]
outcomes = [
    "business growth",
    "data-driven decisions",
    "market success",
    "positive user experiences",
    "system reliability",
]
fields = [
    "software development",
    "data analysis",
    "product management",
    "user experience design",
    "IT administration",
]
focuses = [
    "innovation",
    "efficiency",
    "user satisfaction",
    "business growth",
    "system reliability",
]
capabilities = [
    "adapt to new challenges",
    "meet project deadlines",
    "communicate effectively",
    "work independently",
    "lead a team",
]

# Generate 200 descriptions
descriptions = []
for _ in range(200):
    description = " ".join(
        [
            random.choice(sentences).format(
                role=random.choice(roles),
                responsibility=random.choice(responsibilities),
                collaboration=random.choice(collaborations),
                goal=random.choice(goals),
                technology=random.choice(requirements),
                concept=random.choice(concepts),
                task=random.choice(tasks),
                standard=random.choice(standards),
                environment=random.choice(environments),
                skill=random.choice(skills),
                activity=random.choice(activities),
                impact=random.choice(impacts),
                condition=random.choice(conditions),
                quality=random.choice(qualities),
                value=random.choice(values),
                department=random.choice(departments),
                objective=random.choice(objectives),
                outcome=random.choice(outcomes),
                field=random.choice(fields),
                focus=random.choice(focuses),
                capability=random.choice(capabilities),
            )
            for _ in range(10)
        ]
    )  # 10 sentences per description
    descriptions.append(description)

# Write to CSV
with open("descriptions.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["description"])
    for description in descriptions:
        writer.writerow([description])

print("Generated 200 descriptions and saved to descriptions.csv.")


# Generate CSVs
write_to_csv("titles.csv", ["title"], roles)
write_to_csv("requirements.csv", ["requirements"], requirements)
write_to_csv("locations.csv", ["location"], locations)
write_to_csv("salaries.csv", ["salary"], salaries)

print("CSV files generated successfully.")
