package com.portfolio.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    // private final GeminiWebSocketHandler geminiWebSocketHandler;

    public WebSocketConfig() {
        // Handlers removed for direct Gemini connection
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // No local websocket handlers anymore
    }
}
