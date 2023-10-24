package com.wise.MarketingPlatForm.global.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.wise.MarketingPlatForm.global.filter.GenericDataResourceFilter;

@Configuration
public class FilterConfig {

  @Bean
  public FilterRegistrationBean<GenericDataResourceFilter> genericDataResourceFilter() {
      FilterRegistrationBean<GenericDataResourceFilter> registrationBean = new FilterRegistrationBean<>();
      registrationBean.setFilter(new GenericDataResourceFilter());
      registrationBean.addUrlPatterns("/*");
      registrationBean.addInitParameter("encoding", "utf-8");
      return registrationBean;
  }

}
