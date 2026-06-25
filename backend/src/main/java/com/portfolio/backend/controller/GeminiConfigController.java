package com.portfolio.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
public class GeminiConfigController {

    @Value("${gemini.api.key:}")
    private String configuredApiKey;

    private final com.portfolio.backend.service.GeminiService geminiService;

    public GeminiConfigController(com.portfolio.backend.service.GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/credentials")
    public ResponseEntity<Map<String, String>> getCredentials() {
        String activeKey = (configuredApiKey == null || configuredApiKey.trim().isEmpty()) 
                ? System.getenv("GEMINI_API_KEY") : configuredApiKey;
        
        Map<String, String> response = new HashMap<>();
        if (activeKey != null && !activeKey.trim().isEmpty()) {
            response.put("apiKey", activeKey);
            response.put("model", "models/gemini-2.5-flash-native-audio-latest");
            response.put("systemInstruction", geminiService.compileSystemInstructions());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "API Key not configured on backend");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
