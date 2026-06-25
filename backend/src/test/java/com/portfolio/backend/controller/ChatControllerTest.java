package com.portfolio.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.backend.dto.ChatRequest;
import com.portfolio.backend.service.GeminiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.portfolio.backend.security.JwtAuthFilter;
import com.portfolio.backend.security.SecurityConfig;
import org.springframework.context.annotation.Import;

@WebMvcTest(ChatController.class)
@Import(SecurityConfig.class)
public class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GeminiService geminiService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testChatWithAvatar_Success() throws Exception {
        ChatRequest request = new ChatRequest("Hello!");
        when(geminiService.generateAvatarResponse("Hello!")).thenReturn("Hi there, I am Vidya's AI Avatar!");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value("Hi there, I am Vidya's AI Avatar!"));
    }

    @Test
    public void testChatWithAvatar_ValidationError() throws Exception {
        ChatRequest request = new ChatRequest("");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.errors.message").value("Message cannot be empty"));
    }
}
