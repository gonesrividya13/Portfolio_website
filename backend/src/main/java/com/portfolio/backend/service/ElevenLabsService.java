package com.portfolio.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ElevenLabsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${elevenlabs.api.key:}")
    private String apiKey;

    @Value("${elevenlabs.voice.id:}")
    private String voiceId;

    public ElevenLabsService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public boolean isConfigured() {
        String activeKey = getActiveKey();
        String activeVoiceId = getActiveVoiceId();
        return activeKey != null && !activeKey.trim().isEmpty() 
            && activeVoiceId != null && !activeVoiceId.trim().isEmpty();
    }

    public byte[] generateSpeech(String text) {
        String activeKey = getActiveKey();
        String activeVoiceId = getActiveVoiceId();

        if (activeKey == null || activeKey.trim().isEmpty() 
            || activeVoiceId == null || activeVoiceId.trim().isEmpty()) {
            return new byte[0];
        }

        try {
            String url = "https://api.elevenlabs.io/v1/text-to-speech/" + activeVoiceId + "/stream";

            // Build request payload
            ObjectNode rootNode = objectMapper.createObjectNode();
            rootNode.put("text", text);
            rootNode.put("model_id", "eleven_multilingual_v2");
            
            ObjectNode voiceSettings = rootNode.putObject("voice_settings");
            voiceSettings.put("stability", 0.5);
            voiceSettings.put("similarity_boost", 0.75);

            String requestJson = objectMapper.writeValueAsString(rootNode);

            // Setup headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("xi-api-key", activeKey);
            headers.set("accept", "audio/mpeg");

            HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

            // Execute POST to ElevenLabs
            ResponseEntity<byte[]> response = restTemplate.postForEntity(url, entity, byte[].class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error calling ElevenLabs API: " + e.getMessage());
        }

        return new byte[0];
    }

    private String getActiveKey() {
        return (apiKey == null || apiKey.trim().isEmpty()) ? System.getenv("ELEVENLABS_API_KEY") : apiKey;
    }

    private String getActiveVoiceId() {
        return (voiceId == null || voiceId.trim().isEmpty()) ? System.getenv("ELEVENLABS_VOICE_ID") : voiceId;
    }
}
