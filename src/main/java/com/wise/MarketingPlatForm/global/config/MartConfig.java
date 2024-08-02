package com.wise.MarketingPlatForm.global.config;

import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import javax.annotation.Resource;

@Component
public class MartConfig {

    @Resource(name = "martTemplates")
    MartSqlSession martSqlSession;

    public void setMartDataSource(DsMstrDTO dsMstrDTO) {
    	SqlSessionTemplate templateChecker = martSqlSession.sessionTemplates.get(dsMstrDTO.getDsId());

        if (templateChecker == null) {
            try {
                SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();

                HikariConfig hikariConfig = new HikariConfig();
                hikariConfig.setDriverClassName(dsMstrDTO.getDbmsType().getDriver());
                hikariConfig.setJdbcUrl(dsMstrDTO.getDbmsType().getUrl(dsMstrDTO));
                hikariConfig.setUsername(dsMstrDTO.getUserId());
                hikariConfig.setPassword(dsMstrDTO.getPassword());
                hikariConfig.setConnectionTimeout(120000);
                hikariConfig.setIdleTimeout(1800000);

                HikariDataSource dataSource = new HikariDataSource(hikariConfig);

                sqlSessionFactoryBean.setDataSource(dataSource);
                sqlSessionFactoryBean.setTypeAliasesPackage("com.wise.MarketingPlatForm");
                sqlSessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver()
                        .getResource("classpath:/mybatis/mybatis-mart-config.xml"));
                sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                        .getResources("classpath:/mapper/mart/Mart.xml"));
                SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactoryBean.getObject());

                martSqlSession.sessionTemplates.put(dsMstrDTO.getDsId(), template);
            } catch (Exception e) {
            	 e.printStackTrace();
            }
        }
    }

}