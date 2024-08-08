package com.wise.MarketingPlatForm;

import org.apache.catalina.Context;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.wise.MarketingPlatForm.global.context.BeanContext;

import lombok.NoArgsConstructor;

@NoArgsConstructor
@SpringBootApplication
@EnableScheduling
public class MarketingPlatFormApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MarketingPlatFormApplication.class, args);

        BeanContext.init(context);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MarketingPlatFormApplication.class);
    }

    private static boolean distributable;

    public static boolean getDistributable() {
		return distributable;
	}

    @Bean
	public ServletWebServerFactory tomcatFactory() {
		return new TomcatServletWebServerFactory() {
			@Override
			protected void postProcessContext(Context context) {
				MarketingPlatFormApplication.distributable = context.getDistributable();
				System.out.println("distributable is :"+distributable);
			}
		};
	}
}
