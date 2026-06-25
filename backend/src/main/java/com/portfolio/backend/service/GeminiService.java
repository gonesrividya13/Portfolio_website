package com.portfolio.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.portfolio.backend.model.Experience;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.Skill;
import com.portfolio.backend.repository.ExperienceRepository;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.util.StreamUtils;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key:}")
    private String apiKey;

    public GeminiService(ProjectRepository projectRepository,
                         SkillRepository skillRepository,
                         ExperienceRepository experienceRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.objectMapper = new ObjectMapper();
        this.restTemplate = new RestTemplate();
    }

    private String loadAiContextFiles() {
        StringBuilder context = new StringBuilder();
        try {
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath*:ai-context/*.md");
            for (Resource resource : resources) {
                String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                context.append(content).append("\n\n");
            }
        } catch (Exception e) {
            System.err.println("Failed to load AI context files: " + e.getMessage());
        }
        return context.toString();
    }

    public String generateAvatarResponse(String userPrompt) {
        // Fallback to environment variable if application.properties value is empty
        String activeKey = (apiKey == null || apiKey.trim().isEmpty()) ? System.getenv("GEMINI_API_KEY") : apiKey;

        if (activeKey == null || activeKey.trim().isEmpty()) {
            return generateMockResponse(userPrompt);
        }

        try {
            String systemInstructions = compileSystemInstructions();
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + activeKey;

            // Constructing request body manually using Jackson
            ObjectNode rootNode = objectMapper.createObjectNode();

            // contents array
            ArrayNode contentsArray = rootNode.putArray("contents");
            ObjectNode contentNode = contentsArray.addObject();
            ArrayNode partsArray = contentNode.putArray("parts");
            partsArray.addObject().put("text", userPrompt);

            // systemInstruction node
            ObjectNode systemInstructionNode = rootNode.putObject("systemInstruction");
            ArrayNode systemPartsArray = systemInstructionNode.putArray("parts");
            systemPartsArray.addObject().put("text", systemInstructions);

            // Request setup
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(rootNode), headers);

            // API Call
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                JsonNode candidates = responseJson.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode textNode = candidates.get(0)
                            .path("content")
                            .path("parts");
                    if (textNode.isArray() && !textNode.isEmpty()) {
                        return textNode.get(0).path("text").asText();
                    }
                }
            }
            return "I received your message, but I encountered an issue processing a response from my intelligence engine. Please try again.";
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return "My AI system experienced an error. Details: " + e.getMessage();
        }
    }

    public String compileSystemInstructions() {
        List<Project> projects = projectRepository.findAll();
        List<Skill> skills = skillRepository.findAll();
        List<Experience> experiences = experienceRepository.findAll();

        StringBuilder sb = new StringBuilder();
        
        String customContext = loadAiContextFiles();
        if (!customContext.isEmpty()) {
            sb.append("--- CUSTOM AI RULES & BACKGROUND ---\n");
            sb.append(customContext).append("\n");
        } else {
            sb.append("You are the AI avatar/virtual double representing Vidya, a talented Software Engineer.\n");
            sb.append("Your job is to chat with recruiters and website visitors about Vidya's professional background, achievements, and technical expertise.\n\n");
        }

        sb.append("--- LIVE PORTFOLIO PROFILE DATA ---\n\n");

        sb.append("SKILLS:\n");
        if (skills.isEmpty()) {
            sb.append("- Java, Spring Boot, React, JavaScript, SQL, Git, Docker (General technical stack)\n");
        } else {
            for (Skill s : skills) {
                sb.append(String.format("- [%s] Category: %s, Level: %s\n", s.getName(), s.getCategory(), s.getProficiencyLevel()));
            }
        }
        sb.append("\n");

        sb.append("PROJECTS:\n");
        if (projects.isEmpty()) {
            sb.append("- Personal Portfolio: A full-stack website demonstrating skills.\n");
        } else {
            for (Project p : projects) {
                sb.append(String.format("- Title: %s\n  Description: %s\n  Technologies: %s\n  GitHub: %s\n  Live Link: %s\n\n",
                        p.getTitle(), p.getDescription(), String.join(", ", p.getTechnologies()), p.getGithubUrl(), p.getLiveUrl()));
            }
        }

        sb.append("WORK EXPERIENCE:\n");
        if (experiences.isEmpty()) {
            sb.append("- Software Engineer: Developing and testing web applications.\n");
        } else {
            for (Experience ex : experiences) {
                sb.append(String.format("- Company: %s\n  Role: %s\n  Timeline: %s to %s\n  Description: %s\n\n",
                        ex.getCompany(), ex.getRole(), ex.getStartDate(),
                        ex.getEndDate() != null ? ex.getEndDate() : "Present",
                        ex.getDescription()));
            }
        }

        return sb.toString();
    }

    private String generateMockResponse(String userPrompt) {
        String prompt = userPrompt.toLowerCase();
        
        if (prompt.contains("java") || prompt.contains("backend") || prompt.contains("spring")) {
            return "I specialize in backend development with Java and Spring Boot. For instance, I built an enterprise E-Commerce microservices API that optimized database queries, reducing response times by 30%.";
        }
        if (prompt.contains("react") || prompt.contains("frontend") || prompt.contains("ui")) {
            return "I am highly proficient in React and modern CSS features like grid and glassmorphism. This portfolio site is a great example, featuring custom animations and seamless API integrations.";
        }
        if (prompt.contains("project") || prompt.contains("work")) {
            return "Some of my favorite projects include a full-scale microservices E-Commerce platform, a real-time Kanban Task Board, and this interactive AI Portfolio itself. Check out the Projects section below for live links!";
        }
        if (prompt.contains("skill") || prompt.contains("technology") || prompt.contains("stack")) {
            return "My core stack includes Java, Spring Boot, React, JavaScript, SQL, and Git. I also have hands-on experience deploying containerized services with Docker and managing JPA/Hibernate persistence layers.";
        }
        if (prompt.contains("experience") || prompt.contains("job") || prompt.contains("company")) {
            return "I was a Senior Software Engineer at Tech Solutions Inc., leading a microservices revamp, and previously worked at Creative Web Agency developing interactive client interfaces in React.";
        }
        if (prompt.contains("contact") || prompt.contains("hire") || prompt.contains("email")) {
            return "I'd love to connect! You can reach out directly using the Contact Form at the bottom of the page, or email me at vidya@example.com.";
        }
        
        return "[Mock Mode] Thanks for asking! I'm Vidya's AI Avatar. Currently, my live Gemini API connection is in demo mode, but you can see from my profile that I'm a passionate full-stack developer skilled in React, Spring Boot, and Java.";
    }
}
