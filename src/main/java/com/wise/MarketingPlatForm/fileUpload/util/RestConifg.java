package com.wise.MarketingPlatForm.fileUpload.util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConifg {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
