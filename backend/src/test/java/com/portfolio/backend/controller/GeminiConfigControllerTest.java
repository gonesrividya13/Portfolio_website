package com.portfolio.backend.controller;

import com.portfolio.backend.service.GeminiService;
import com.portfolio.backend.security.JwtAuthFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GeminiConfigController.class)
@TestPropertySource(properties = {"gemini.api.key=TEST_API_KEY"})
public class GeminiConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GeminiService geminiService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    public void testGetCredentials_Success() throws Exception {
        when(geminiService.compileSystemInstructions()).thenReturn("System instruction mock");
        
        mockMvc.perform(get("/api/gemini/credentials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.apiKey").value("TEST_API_KEY"))
                .andExpect(jsonPath("$.model").value("models/gemini-2.5-flash-native-audio-latest"))
                .andExpect(jsonPath("$.systemInstruction").value("System instruction mock"));
    }
}
