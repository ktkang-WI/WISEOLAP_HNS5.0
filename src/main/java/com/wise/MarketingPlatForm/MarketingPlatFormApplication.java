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

import com.grapecity.documents.excel.*;
import com.grapecity.documents.excel.drawing.*;
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
        Workbook.SetLicenseKey("E388988213738328#A0xZSRiwiI8IzM8MzNzEjM8gTO8gzMiojIklkI1pjIEJCLi4TPBZDa4NzbHl6Qq5kSoBzba54RaJnRrx4MGJkbm5GeR9EMWRUY8IzQ5Mjb5BzbBFXMrg5VzxEUXlHaGRnbxUndGl5YN9UePZEN73UW6pUR5BnSqBzQ0RmI0IyUiwCM5MTMyQTM9QTM0IicfJye35XX3JSVDRkMiojIDJCLicjdgEmdhpEIsV6Y8VEIy3mZgQnbl5Wdj3GRgM4RiojIOJyebpjIkJHUiwiI8QTNxIDMgATMwEDNyAjMiojI4J7QiwiI9ATMxQjMwIjI0ICc8VkIsISKRWZ12eI1kWJ1ImZ1o4YhtTbnsTYlsjLhsTInsLiOiEmTDJCLlVncJp3I");
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
