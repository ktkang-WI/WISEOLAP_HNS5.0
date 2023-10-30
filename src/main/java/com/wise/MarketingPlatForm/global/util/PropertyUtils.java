package com.wise.MarketingPlatForm.global.util;

import org.springframework.core.env.Environment;

import com.wise.MarketingPlatForm.global.context.BeanContext;

public class PropertyUtils {

    private static Environment environment(){
        return BeanContext.get(Environment.class);	
    }

    public static String getProperty(String key){
        return environment().getProperty(key);
    }
}