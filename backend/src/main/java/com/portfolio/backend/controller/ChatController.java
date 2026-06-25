package com.portfolio.backend.controller;

import com.portfolio.backend.dto.ChatRequest;
import com.portfolio.backend.dto.ChatResponse;
import com.portfolio.backend.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chatWithAvatar(@Valid @RequestBody ChatRequest request) {
        String answer = geminiService.generateAvatarResponse(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(answer));
    }

    @org.springframework.web.bind.annotation.GetMapping("/live-token")
    public ResponseEntity<java.util.Map<String, Object>> getLiveChatToken() {
        com.fasterxml.jackson.databind.JsonNode tokenNode = geminiService.generateEphemeralToken();
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", tokenNode.path("token").asText());
        response.put("expiresAt", tokenNode.path("expirationTime").asText()); // or whatever the field is. wait, Python docs said token.expires_at, REST probably is expirationTime or similar. We can just pass the whole JSON node back actually!
        response.put("systemInstruction", geminiService.compileSystemInstructions());
        return ResponseEntity.ok(response);
    }
}
