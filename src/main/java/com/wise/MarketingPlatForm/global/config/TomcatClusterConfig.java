package com.wise.MarketingPlatForm.global.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
@Configuration
public class TomcatClusterConfig {
    
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatClusterCustomizer() {
        return (factory) -> factory.addContextCustomizers((context) -> {
            context.setDistributable(true);
        });
    }
}
