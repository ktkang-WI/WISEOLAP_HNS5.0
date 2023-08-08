package com.wise.MarketingPlatForm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class MarketingPlatFormApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(MarketingPlatFormApplication.class, args);
	}
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MarketingPlatFormApplication.class);
    }

}
