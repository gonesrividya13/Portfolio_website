package com.portfolio.backend.service;

import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProjects() {
        Project p1 = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        Project p2 = new Project("Title 2", "Desc 2", Arrays.asList("Python"), "url1", "url2", "url3");
        
        when(projectRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Project> result = projectService.getAllProjects();
        assertEquals(2, result.size());
        assertEquals("Title 1", result.get(0).getTitle());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    public void testGetProjectById_Success() {
        Project p = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        p.setId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(p));

        Project result = projectService.getProjectById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Title 1", result.getTitle());
    }

    @Test
    public void testGetProjectById_NotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById(1L);
        });
    }

    @Test
    public void testCreateProject() {
        Project p = new Project("Title 1", "Desc 1", Arrays.asList("Java"), "url1", "url2", "url3");
        when(projectRepository.save(p)).thenReturn(p);

        Project result = projectService.createProject(p);
        assertNotNull(result);
        assertEquals("Title 1", result.getTitle());
    }
}
