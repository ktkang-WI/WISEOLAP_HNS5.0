package com.wise.MarketingPlatForm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;

import com.wise.MarketingPlatForm.global.context.BeanContext;

import lombok.NoArgsConstructor;

@NoArgsConstructor
@SpringBootApplication
public class MarketingPlatFormApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MarketingPlatFormApplication.class, args);

        BeanContext.init(context);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MarketingPlatFormApplication.class);
    }

}
