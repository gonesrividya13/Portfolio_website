package com.portfolio.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.portfolio.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GeminiWebSocketHandler extends TextWebSocketHandler {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    
    @Value("${gemini.api.key:}")
    private String configuredApiKey;

    private final Map<String, WebSocket> geminiSessions = new ConcurrentHashMap<>();

    public GeminiWebSocketHandler(GeminiService geminiService) {
        this.geminiService = geminiService;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    private String getApiKey() {
        String activeKey = (configuredApiKey == null || configuredApiKey.trim().isEmpty()) 
                ? System.getenv("GEMINI_API_KEY") : configuredApiKey;
        return activeKey;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String apiKey = getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.err.println("Gemini API Key is missing. Closing WebSocket connection.");
            session.close(CloseStatus.SERVER_ERROR.withReason("Missing API Key"));
            return;
        }

        String geminiUrl = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=" + apiKey;

        WebSocket.Builder webSocketBuilder = httpClient.newWebSocketBuilder();
        webSocketBuilder.buildAsync(URI.create(geminiUrl), new WebSocket.Listener() {
            private StringBuilder textPart = new StringBuilder();

            @Override
            public void onOpen(WebSocket webSocket) {
                geminiSessions.put(session.getId(), webSocket);
                WebSocket.Listener.super.onOpen(webSocket);
                
                try {
                    // Send Setup Message with "Aoede" voice
                    ObjectNode root = objectMapper.createObjectNode();
                    ObjectNode setup = root.putObject("setup");
                    setup.put("model", "models/gemini-2.5-flash-native-audio-latest");

                    ObjectNode generationConfig = setup.putObject("generationConfig");
                    ArrayNode responseModalities = generationConfig.putArray("responseModalities");
                    responseModalities.add("AUDIO");
                    
                    ObjectNode speechConfig = generationConfig.putObject("speechConfig");
                    ObjectNode voiceConfig = speechConfig.putObject("voiceConfig");
                    ObjectNode prebuiltVoiceConfig = voiceConfig.putObject("prebuiltVoiceConfig");
                    prebuiltVoiceConfig.put("voiceName", "Aoede"); // Female voice

                    ObjectNode systemInstruction = setup.putObject("systemInstruction");
                    ArrayNode parts = systemInstruction.putArray("parts");
                    parts.addObject().put("text", geminiService.compileSystemInstructions());

                    webSocket.sendText(objectMapper.writeValueAsString(root), true).join();
                    
                    // Force an initial greeting
                    ObjectNode initialMessage = objectMapper.createObjectNode();
                    ObjectNode clientContent = initialMessage.putObject("clientContent");
                    ArrayNode messageTurns = clientContent.putArray("turns");
                    ObjectNode turn = messageTurns.addObject();
                    turn.put("role", "user");
                    turn.putArray("parts").addObject().put("text", "Hello! Please briefly introduce yourself in one sentence so I know your audio is working.");
                    clientContent.put("turnComplete", true);
                    
                    webSocket.sendText(objectMapper.writeValueAsString(initialMessage), true).join();
                } catch (Exception e) {
                    System.err.println("Error sending setup message: " + e.getMessage());
                }
            }

            @Override
            public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
                textPart.append(data);
                if (last) {
                    try {
                        if (session.isOpen()) {
                            session.sendMessage(new TextMessage(textPart.toString()));
                        }
                    } catch (Exception e) {
                        System.err.println("Error sending message to client: " + e.getMessage());
                    }
                    textPart.setLength(0); // Reset buffer
                }
                webSocket.request(1);
                return null;
            }

            @Override
            public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
                try {
                    if (session.isOpen()) {
                        session.close(new CloseStatus(statusCode, reason));
                    }
                } catch (Exception e) {
                    System.err.println("Error closing client session: " + e.getMessage());
                }
                geminiSessions.remove(session.getId());
                return null;
            }

            @Override
            public void onError(WebSocket webSocket, Throwable error) {
                System.err.println("Gemini WebSocket error: " + error.getMessage());
                try {
                    if (session.isOpen()) {
                        session.close(CloseStatus.SERVER_ERROR);
                    }
                } catch (Exception e) {
                    // ignore
                }
                geminiSessions.remove(session.getId());
            }
        });
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        WebSocket geminiSocket = geminiSessions.get(session.getId());
        if (geminiSocket != null) {
            // Forward message from client to Gemini API
            synchronized (geminiSocket) {
                geminiSocket.sendText(message.getPayload(), true).join();
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        WebSocket geminiSocket = geminiSessions.remove(session.getId());
        if (geminiSocket != null) {
            // Abort or close connection to Gemini
            geminiSocket.sendClose(WebSocket.NORMAL_CLOSURE, "Client disconnected");
        }
    }
}
