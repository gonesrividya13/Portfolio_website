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
}
