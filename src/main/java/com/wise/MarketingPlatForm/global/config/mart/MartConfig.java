package com.wise.MarketingPlatForm.global.config.mart;

import com.wise.MarketingPlatForm.dataset.type.DBMSType;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import javax.annotation.Resource;


@Component
public class MartConfig {
	
	@Resource(name="martTemplates")
	MartSqlSession martSqlSession;

    public void setMartDataSource(DSMstrDTO dsMstrDTO) {
        try {
        	SqlSessionTemplate templateChecker = martSqlSession.sessionTemplates.get(dsMstrDTO.getDsId());
        	
        	if(templateChecker != null) {
        		martSqlSession.sessionTemplate = templateChecker;
        	} else {
        		HikariConfig hikariConfig = new HikariConfig();
        		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        		
        		hikariConfig.setDriverClassName(dsMstrDTO.getDbmsType().getDriver());
        		hikariConfig.setJdbcUrl("jdbc:sqlserver://3.39.141.250:1433;DatabaseName=WISE_JK"); 
        		hikariConfig.setUsername(dsMstrDTO.getUserId());
        		hikariConfig.setPassword(dsMstrDTO.getPassword());
        		
        		HikariDataSource dataSource = new HikariDataSource(hikariConfig);
        		
        		sqlSessionFactoryBean.setDataSource(dataSource);
        		sqlSessionFactoryBean.setTypeAliasesPackage("com.wise.MarketingPlatForm");
        		sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResource("classpath:/mapper/Mart.xml"));
        		SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactoryBean.getObject());
        		
        		martSqlSession.sessionTemplates.put(dsMstrDTO.getDsId(), template);
        		martSqlSession.sessionTemplate = martSqlSession.sessionTemplates.get(dsMstrDTO.getDsId());
        	}
		} catch (Exception e) {
			
		} 
    }

}