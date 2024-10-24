package com.wise.MarketingPlatForm.global.config;

import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

@Component
public class MartConfig {

    @Resource(name = "martTemplates")
    MartSqlSession martSqlSession;

    @Value("${connection.pool.min}")
    private int configMinConnectionPool;

    @Value("${connection.pool.max}")
    private int configMaxConnectionPool;

    @Value("${datasource.mstr.dsname}")
    private String dsNmList;

    public void setMartDataSource(DsMstrDTO dsMstrDTO) {
    	SqlSessionTemplate templateChecker = martSqlSession.sessionTemplates.get(dsMstrDTO.getDsId());

        if (templateChecker == null) {
            try {
                List<String> resourceList = (dsNmList != null && !dsNmList.isEmpty())
                                    ? Arrays.asList(dsNmList.split(","))
                                    : Collections.emptyList();

                if (resourceList.indexOf(dsMstrDTO.getDsNm()) > -1) {
                    String dsName = dsMstrDTO.getDsNm().toLowerCase();
                    System.out.println(dsName);
                    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
                    JndiObjectFactoryBean jndiObjectFactoryBean = new JndiObjectFactoryBean();
                    jndiObjectFactoryBean.setJndiName("java:comp/env/jdbc/"+dsName);
                    jndiObjectFactoryBean.afterPropertiesSet();
                    
                    DataSource dataSource = (DataSource) jndiObjectFactoryBean.getObject();
                    System.out.println(dataSource);
                    sqlSessionFactoryBean.setDataSource(dataSource);
                    sqlSessionFactoryBean.setTypeAliasesPackage("com.wise.MarketingPlatForm");
                    sqlSessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver()
                        .getResource("classpath:/mybatis/mybatis-mart-config.xml"));
                    sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                        .getResources("classpath:/mapper/mart/Mart.xml"));
                    
                    SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactoryBean.getObject());

                    martSqlSession.sessionTemplates.put(dsMstrDTO.getDsId(), template);
                } else {
            
                    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();

                    HikariConfig hikariConfig = new HikariConfig();
                    hikariConfig.setDriverClassName(dsMstrDTO.getDbmsType().getDriver());
                    hikariConfig.setJdbcUrl(dsMstrDTO.getDbmsType().getUrl(dsMstrDTO));
                    hikariConfig.setUsername(dsMstrDTO.getUserId());
                    hikariConfig.setPassword(dsMstrDTO.getPassword());
                    
                    // shlim 2024-10-16 커넥션 설정추가
                    // hikariConfig.setMinimumIdle(10);
                    hikariConfig.setConnectionTimeout(30000); //커넥션 풀 
                    hikariConfig.setIdleTimeout(300000);
                    hikariConfig.setMaxLifetime(1800000);
                    hikariConfig.setKeepaliveTime(30000);
                    hikariConfig.setMinimumIdle(configMinConnectionPool);
                    hikariConfig.setMaximumPoolSize(configMaxConnectionPool);
                    hikariConfig.setValidationTimeout(5000); //커넥션 풀 
                    hikariConfig.setLeakDetectionThreshold(60000);

                    

                    HikariDataSource dataSource = new HikariDataSource(hikariConfig);

                    sqlSessionFactoryBean.setDataSource(dataSource);
                    sqlSessionFactoryBean.setTypeAliasesPackage("com.wise.MarketingPlatForm");
                    sqlSessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver()
                            .getResource("classpath:/mybatis/mybatis-mart-config.xml"));
                    sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                            .getResources("classpath:/mapper/mart/Mart.xml"));
                    SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactoryBean.getObject());

                    martSqlSession.sessionTemplates.put(dsMstrDTO.getDsId(), template);
                }
            } catch (Exception e) {
            	 e.printStackTrace();
            }
        }
    }

}