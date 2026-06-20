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
                    "Personal Portfolio",
                    "A modern portfolio web application showcasing projects, experiences, and skills.",
                    Arrays.asList("React", "Spring Boot", "H2 Database", "Tailwind CSS"),
                    "https://github.com/example/portfolio",
                    "https://portfolio.example.com",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            );

            Project project2 = new Project(
                    "E-Commerce Platform",
                    "A full-featured e-commerce API supporting product management, cart operations, and order checkout.",
                    Arrays.asList("Java", "Spring Boot", "PostgreSQL", "Docker"),
                    "https://github.com/example/ecommerce",
                    "https://ecommerce.example.com",
                    "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80"
            );

            Project project3 = new Project(
                    "Task Management App",
                    "A collaborative kanban board application with real-time updates and task assignment features.",
                    Arrays.asList("React", "Node.js", "Express", "MongoDB", "Socket.io"),
                    "https://github.com/example/taskmanager",
                    "https://taskmanager.example.com",
                    "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=800&q=80"
            );

            projectRepository.saveAll(Arrays.asList(project1, project2, project3));
            System.out.println("Seeded projects database successfully.");
        }

        if (skillRepository.count() == 0) {
            Skill skill1 = new Skill("Java", "Backend", "Advanced");
            Skill skill2 = new Skill("Spring Boot", "Backend", "Advanced");
            Skill skill3 = new Skill("React", "Frontend", "Intermediate");
            Skill skill4 = new Skill("JavaScript", "Frontend", "Advanced");
            Skill skill5 = new Skill("SQL", "Database", "Intermediate");
            Skill skill6 = new Skill("Git", "Tool", "Advanced");
            Skill skill7 = new Skill("Docker", "Tool", "Intermediate");

            skillRepository.saveAll(Arrays.asList(skill1, skill2, skill3, skill4, skill5, skill6, skill7));
            System.out.println("Seeded skills database successfully.");
        }

        if (experienceRepository.count() == 0) {
            Experience exp1 = new Experience(
                    "Tech Solutions Inc.",
                    "Senior Software Engineer",
                    LocalDate.of(2023, 1, 15),
                    null,
                    "Led a team of 4 developers to build a microservices-based e-commerce platform. Optimized database queries, reducing response times by 30%."
            );

            Experience exp2 = new Experience(
                    "Creative Web Agency",
                    "Software Engineer",
                    LocalDate.of(2021, 6, 1),
                    LocalDate.of(2023, 1, 10),
                    "Developed and maintained interactive user interfaces using React. Integrated frontend features with Spring Boot backend REST APIs."
            );

            experienceRepository.saveAll(Arrays.asList(exp1, exp2));
            System.out.println("Seeded experiences database successfully.");
        }

        if (contactMessageRepository.count() == 0) {
            ContactMessage message = new ContactMessage(
                    "Alice Smith",
                    "alice@example.com",
                    "Hi! I love your portfolio. I would love to connect and discuss potential opportunities."
            );
            contactMessageRepository.save(message);
            System.out.println("Seeded contact messages database successfully.");
        }
    }
}
