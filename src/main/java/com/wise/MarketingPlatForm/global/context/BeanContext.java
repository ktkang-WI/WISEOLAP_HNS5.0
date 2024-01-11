package com.wise.MarketingPlatForm.global.context;

import org.springframework.context.ApplicationContext;

import com.wise.MarketingPlatForm.global.provider.ApplicationContextProvider;

public class BeanContext {
    private static ApplicationContext context;

    public static void init(ApplicationContext context) { // 1. applicationContext 를 주입받을 메서드
        BeanContext.context = context;
    }

    public static <T> T get(Class<T> clazz) {
        return context.getBean(clazz);
    }

    public static <T> T getBean(Class<T> clazz) {
        ApplicationContext applicationContext = ApplicationContextProvider.getApplicationContext();
        return applicationContext.getBean(clazz);
    }
}