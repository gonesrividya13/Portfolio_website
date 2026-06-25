package com.portfolio.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.portfolio.backend.security.JwtAuthFilter;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllProjects() throws Exception {
        Project p1 = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        p1.setId(1L);

        when(projectService.getAllProjects()).thenReturn(Arrays.asList(p1));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Title 1"));
    }

    @Test
    public void testGetProjectById_Success() throws Exception {
        Project p = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        p.setId(1L);

        when(projectService.getProjectById(1L)).thenReturn(p);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Title 1"));
    }

    @Test
    public void testCreateProject_Success() throws Exception {
        Project p = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        Project saved = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        saved.setId(1L);

        when(projectService.createProject(any(Project.class))).thenReturn(saved);

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Title 1"));
    }

    @Test
    public void testCreateProject_ValidationError() throws Exception {
        Project p = new Project("", "", null, "url1", "url2", "url3");

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.description").exists());
    }
}
