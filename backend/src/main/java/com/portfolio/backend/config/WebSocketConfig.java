package com.portfolio.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final GeminiWebSocketHandler geminiWebSocketHandler;

    public WebSocketConfig(GeminiWebSocketHandler geminiWebSocketHandler) {
        this.geminiWebSocketHandler = geminiWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(geminiWebSocketHandler, "/api/live-chat")
                .setAllowedOriginPatterns("*");
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean createWebSocketContainer() {
        org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean container = new org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(1024 * 1024); // 1 MB
        container.setMaxBinaryMessageBufferSize(1024 * 1024); // 1 MB
        return container;
    }
}
