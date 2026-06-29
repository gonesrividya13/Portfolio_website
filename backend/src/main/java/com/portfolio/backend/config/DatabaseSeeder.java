package com.portfolio.backend.config;

import com.portfolio.backend.model.ContactMessage;
import com.portfolio.backend.model.Experience;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.Skill;
import com.portfolio.backend.repository.ContactMessageRepository;
import com.portfolio.backend.repository.ExperienceRepository;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ContactMessageRepository contactMessageRepository;

    public DatabaseSeeder(ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          ExperienceRepository experienceRepository,
                          ContactMessageRepository contactMessageRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (projectRepository.count() == 0) {
            Project project1 = new Project(
                    "Cloud Inventory Analytics Pipeline",
                    "Built a real-time data pipeline on GCP using Apache Airflow and BigQuery, processing 10+ retail data streams for inventory analytics and developing Looker dashboards with partitioned datasets to track stock levels and enable anomaly detection across multi-million records.",
                    Arrays.asList("GCP", "Apache Airflow", "BigQuery", "Looker", "Python"),
                    "https://github.com/gonesrividya13",
                    "",
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            );

            Project project2 = new Project(
                    "Interactive 3D AI Portfolio",
                    "A modern, interactive 3D web application showcasing my projects, experiences, and skills. Features an infinite scrolling 3D globe and a live AI voice assistant to guide users through the tour.",
                    Arrays.asList("React", "Three.js", "Tailwind CSS", "Spring Boot", "Java"),
                    "https://github.com/gonesrividya13/VidyaPortfolio",
                    "",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            );

            projectRepository.saveAll(Arrays.asList(project1, project2));
            System.out.println("Seeded projects database successfully.");
        }

        if (skillRepository.count() == 0) {
            skillRepository.saveAll(Arrays.asList(
                    new Skill("Java", "Programming Languages", "Expert"),
                    new Skill("Python", "Programming Languages", "Advanced"),
                    new Skill("JavaScript", "Programming Languages", "Advanced"),
                    new Skill("TypeScript", "Programming Languages", "Intermediate"),
                    new Skill("Spring Boot", "Backend & APIs", "Expert"),
                    new Skill("RESTful APIs", "Backend & APIs", "Expert"),
                    new Skill("Microservices", "Backend & APIs", "Advanced"),
                    new Skill("React.js", "Frontend Development", "Advanced"),
                    new Skill("Angular", "Frontend Development", "Intermediate"),
                    new Skill("AWS", "Cloud & DevOps", "Advanced"),
                    new Skill("Docker", "Cloud & DevOps", "Advanced"),
                    new Skill("CI/CD", "Cloud & DevOps", "Advanced"),
                    new Skill("PostgreSQL", "Databases & Messaging", "Expert"),
                    new Skill("MySQL", "Databases & Messaging", "Advanced"),
                    new Skill("MongoDB", "Databases & Messaging", "Intermediate"),
                    new Skill("Apache Kafka", "Databases & Messaging", "Advanced")
            ));
            System.out.println("Seeded skills database successfully.");
        }

        if (experienceRepository.count() == 0) {
            Experience exp1 = new Experience(
                    "Uber",
                    "Software Developer",
                    LocalDate.of(2025, 8, 1),
                    null,
                    "Developed ride dispatch and trip lifecycle microservices using Java (Spring Boot), processing 400K+ daily events. Built REST APIs for pricing workflows handling 100K+ daily requests. Integrated AWS (S3, Lambda) with Python-based AI workflows (OpenAI APIs), automating handling of 50K+ user interactions. Managed PostgreSQL and MongoDB data layers for high-frequency workloads."
            );

            Experience exp2 = new Experience(
                    "Infosys",
                    "Software Developer",
                    LocalDate.of(2021, 6, 1),
                    LocalDate.of(2023, 6, 1),
                    "Led event-driven data pipelines using Apache Kafka and Java across 3 enterprise applications, enabling reliable processing of 150K+ daily transactions. Owned backend modules for REST APIs using Java and Spring Boot. Implemented asynchronous processing workflows on Azure and engineered React-based UI components with TypeScript."
            );

            Experience exp3 = new Experience(
                    "Dell Technologies",
                    "Full Stack Developer",
                    LocalDate.of(2020, 1, 1),
                    LocalDate.of(2021, 5, 1),
                    "Contributed to backend service development using Python (Django) and REST APIs. Assisted in designing MySQL database schemas using SQLAlchemy ORM managing 800K+ records. Developed Angular-based UI components using TypeScript and Bootstrap. Supported application deployments on AWS (EC2, S3) and containerization using Docker."
            );

            experienceRepository.saveAll(Arrays.asList(exp1, exp2, exp3));
            System.out.println("Seeded experiences database successfully.");
        }

        if (contactMessageRepository.count() == 0) {
            ContactMessage message = new ContactMessage(
                    "Alice Smith",
                    "alice@example.com",
                    "Hi Srividya! I love your portfolio. I would love to connect and discuss potential opportunities."
            );
            contactMessageRepository.save(message);
            System.out.println("Seeded contact messages database successfully.");
        }
    }
}
