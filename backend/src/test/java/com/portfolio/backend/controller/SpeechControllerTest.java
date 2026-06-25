package com.portfolio.backend.controller;

import com.portfolio.backend.service.ElevenLabsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.portfolio.backend.security.JwtAuthFilter;
import com.portfolio.backend.security.SecurityConfig;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(SpeechController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc(addFilters = false)
public class SpeechControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ElevenLabsService elevenLabsService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    public void testGetSpeechAudio_ServiceNotConfigured() throws Exception {
        when(elevenLabsService.isConfigured()).thenReturn(false);

        mockMvc.perform(get("/api/speech")
                        .param("text", "Hello there"))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    public void testGetSpeechAudio_Success() throws Exception {
        byte[] mockMp3 = new byte[]{1, 2, 3, 4};
        when(elevenLabsService.isConfigured()).thenReturn(true);
        when(elevenLabsService.generateSpeech("Hello there")).thenReturn(mockMp3);

        mockMvc.perform(get("/api/speech")
                        .param("text", "Hello there"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType("audio/mpeg")))
                .andExpect(content().bytes(mockMp3));
    }

    @Test
    public void testGetSpeechAudio_Failure() throws Exception {
        when(elevenLabsService.isConfigured()).thenReturn(true);
        when(elevenLabsService.generateSpeech("Hello there")).thenReturn(new byte[0]);

        mockMvc.perform(get("/api/speech")
                        .param("text", "Hello there"))
                .andExpect(status().isInternalServerError());
    }
}
