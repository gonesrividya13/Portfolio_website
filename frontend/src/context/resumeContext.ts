export const getResumeContextForSection = (section: string): string => {
  if (section === "Intro") {
    return `Currently viewing the Intro/Hero section. Resume Summary: Software Developer with around 4 years of experience building distributed backend systems using Java and Spring Boot across mobility, finance, and healthcare platforms. Designed event-driven architectures and scalable services for high-volume, real-time applications handling 400K+ daily events and 100K+ API requests. Strong expertise in MySQL, AWS, CI/CD, Jenkins, and Docker, driving performance optimization and system reliability for large-scale workloads. Applied Python and OpenAI APIs to automate user interactions and improve data quality.`;
  } else if (section === "Experience") {
    return `Currently viewing the Experience section. Full Details:
Software Developer | Uber | USA | Aug 2025 – Present
● Developed ride dispatch and trip lifecycle microservices using Java (Spring Boot)
● Built and maintained REST APIs for pricing and trip workflows, handling 100K+ daily requests
● Defined API contracts using OpenAPI and implemented OAuth 2.0 with Spring Security
● Managed PostgreSQL and MongoDB data layers
● Integrated AWS (S3, Lambda) with Python-based AI workflows (OpenAI APIs)

Software Developer | Infosys | India | Jun 2021 – Jun 2023
● Led event-driven data pipelines using Apache Kafka and Java
● Owned backend modules for REST APIs using Java and Spring Boot
● Implemented asynchronous processing workflows on Azure
● Managed Oracle database design and optimization
● Engineered React-based UI components with TypeScript
● Integrated AI-driven validation workflows using Python and NLP techniques

Full Stack Developer | Dell Technologies | India | Jan 2020 – May 2021
● Contributed to backend service development using Python (Django) and REST APIs
● Assisted in designing and maintaining MySQL database schemas using SQLAlchemy ORM
● Developed Angular-based UI components using TypeScript and Bootstrap
● Supported application deployments on AWS (EC2, S3) and containerization using Docker`;
  } else if (section === "Projects") {
    return `Currently viewing the Projects section. Full Details:
Cloud Inventory Analytics Pipeline | Google Cloud Platform: Built a real-time data pipeline on GCP using Apache Airflow and BigQuery, processing 10+ retail data streams for inventory analytics and developing Looker dashboards with partitioned datasets to track stock levels and enable anomaly detection across multi-million records.

Interactive 3D AI Portfolio: A modern, interactive 3D web application showcasing my projects, experiences, and skills. Features an infinite scrolling 3D globe and a live AI voice assistant to guide users through the tour.

Micro MCP (IoT): A C++ implementation of the Model Context Protocol (MCP) for IoT devices, enabling LLMs to securely interface with home automation systems via MQTT.`;
  } else if (section === "Skills") {
    return `Currently viewing the Skills section. Full Details:
● Programming Languages: Java, Python, JavaScript, TypeScript, C++
● Backend & APIs: Spring Boot, Spring Security, RESTful APIs, Microservices Architecture, Distributed Systems, System Design, API Gateway, GraphQL, FastAPI
● Frontend Development: React.js, Redux, Vue.js (2 & 3), Angular, HTML5, CSS3, SCSS, Bootstrap, Responsive Design
● Cloud & DevOps: AWS (EC2, S3, RDS, Lambda, IAM, CloudWatch), GCP, Docker, Kubernetes, OpenShift, CI/CD
● Databases & Messaging: PostgreSQL, MySQL, MongoDB, Redis, Apache Kafka
● Testing & Quality: JUnit, Mockito, Jest, Unit Testing, Integration Testing, TDD
● Security & Authentication: OAuth 2.0, JWT, Role-Based Access Control, Secure Coding Practices, Encryption Standards
● AI / Machine Learning: ML Integration, Model Deployment, Data Pipelines, Pandas, NumPy
● Tools & Collaboration: Git, GitHub, GitLab, Jira, Confluence, Postman, Figma, IntelliJ IDEA, VS Code
● Methodologies: Agile/Scrum, SDLC, CI/CD, Design Patterns`;
  } else if (section === "Reach Me Out") {
    return `Currently viewing the Reach Me Out (Contact) section. Full Details:
Name: Srividya Gone
Location: California, USA
Phone: 4084753810
Email: srividya1369@gmail.com
Education: Master of Science in Management Information Systems | Northern Illinois University | Illinois, USA | Aug 2023 – May 2025`;
  }
  return "";
};
