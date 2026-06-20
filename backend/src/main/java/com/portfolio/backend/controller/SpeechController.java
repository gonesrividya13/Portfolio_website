package com.portfolio.backend.controller;

import com.portfolio.backend.service.ElevenLabsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/speech")
public class SpeechController {

    private final ElevenLabsService elevenLabsService;

    public SpeechController(ElevenLabsService elevenLabsService) {
        this.elevenLabsService = elevenLabsService;
    }

    @GetMapping
    public ResponseEntity<byte[]> getSpeechAudio(@RequestParam String text) {
        if (!elevenLabsService.isConfigured()) {
            // Service not configured - indicates frontend should fallback to native TTS
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        byte[] audioBytes = elevenLabsService.generateSpeech(text);

        if (audioBytes == null || audioBytes.length == 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
        headers.setContentLength(audioBytes.length);
        headers.setCacheControl("max-age=86400"); // Cache audio files for 1 day

        return new ResponseEntity<>(audioBytes, headers, HttpStatus.OK);
    }
}
