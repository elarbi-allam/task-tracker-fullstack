package com.elarbiallam.task_tracker_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${application.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // On transforme la string "url1,url2" en tableau (trim pour sécurité)
                String[] origins = java.util.Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .toArray(String[]::new);

                // Use allowedOriginPatterns for more flexible matching (ports, hostnames, wildcards)
                registry.addMapping("/**") // Appliquer à tous les endpoints
                        .allowedOriginPatterns(origins)
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true); // Autorise les cookies/headers d'auth

                // Petit log utile pour le debug en dev
                System.out.println("Configured CORS allowed origins: " + String.join(",", origins));
            }
        };
    }
}