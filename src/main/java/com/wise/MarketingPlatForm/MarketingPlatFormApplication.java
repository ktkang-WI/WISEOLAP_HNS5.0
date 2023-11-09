package com.wise.MarketingPlatForm;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;

import com.wise.MarketingPlatForm.global.context.BeanContext;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@SpringBootApplication
public class MarketingPlatFormApplication extends SpringBootServletInitializer {

    private ApplicationContext context;

    public static void main(String[] args) {
        SpringApplication.run(MarketingPlatFormApplication.class, args);
    }

    @PostConstruct
    public void init() {
        BeanContext.init(context);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MarketingPlatFormApplication.class);
    }

}
